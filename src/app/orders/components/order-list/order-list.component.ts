import { Component, NgModule, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../../models/order';
import { OrderGroup } from '../../../models/order-group';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { WebSocketService } from '../../services/websocket.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TableHeaderComponent } from './table/table-header.component';
import { TableOrdersComponent } from './table/table-orders.component';

@Component({
	selector: 'app-order-list',
	standalone: true,
	imports: [
		CommonModule,
		MatIconModule,
		MatSnackBarModule,
		MatBadgeModule,
		MatSlideToggleModule,
		TableHeaderComponent,
		TableOrdersComponent,
	],
	templateUrl: './order-list.component.html',
	styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent implements OnInit {
	orders: Order[] = [];
	groupedOrders: OrderGroup[] = [];
	darkThemeEnabled = false;

	constructor(
		private ordersData: OrderService,
		private webSocketService: WebSocketService,
		private _snackBar: MatSnackBar
	) {}

	ngOnInit() {
		this.ordersData.getOrderData().subscribe((response: any) => {
			this.orders = response.data;
			this.groupOrdersBySymbol();
		});
		// Get WebSocketSubject from WebSocketService
		const socket$ = this.webSocketService.getWebSocketSubject();

		// Subscribe to WebSocket messages
		socket$.subscribe(
			(message: any) => {
				console.log('WebSocket message received:', message);
				this.updateOrdersWithWebSocketData(message); // Call method to update orders based on WebSocket data
			},
			(error: any) => console.error('WebSocket error:', error),
			() => console.log('WebSocket connection closed')
		);
	}
	// Toggle Theme
	toggleTheme() {
		this.darkThemeEnabled = !this.darkThemeEnabled;

		if (this.darkThemeEnabled) {
			document.body.classList.add('dark-theme');
		} else {
			document.body.classList.remove('dark-theme');
		}
	}

	// Method to update orders based on WebSocket data
	updateOrdersWithWebSocketData(message: any) {
		if (message && message.d && Array.isArray(message.d)) {
			message.d.forEach((quote: any) => {
				// Find the corresponding order group in groupedOrders
				const group = this.groupedOrders.find(g => g.symbol === quote.s);
				if (group) {
					// Update orders within the group
					group.orders.forEach(order => {
						if (order.symbol === quote.s) {
							// Assuming you update relevant properties based on 'a' or 'b' as needed
							order.openPrice = quote.a; // Example: update openPrice with 'a' from WebSocket
							// Calculate profit based on updated prices
							order.profit = (order.closePrice - order.openPrice) * order.size;
						}
					});
					// Recalculate group-level data
					this.recalculateGroupData(group);
					this.groupOrdersBySymbol();
				}
			});
		}
	}

	// Method to group orders by symbol
	groupOrdersBySymbol() {
		const groups: { [key: string]: OrderGroup } = {};

		this.orders.forEach(order => {
			if (!groups[order.symbol]) {
				groups[order.symbol] = {
					symbol: order.symbol,
					orders: [],
					openPrice: 0,
					swap: 0,
					profit: 0,
					size: 0,
					showOrders: false,
				};
			}
			groups[order.symbol].orders.push(order);
			groups[order.symbol].openPrice += order.openPrice;
			groups[order.symbol].swap += order.swap;
			groups[order.symbol].profit += (order.closePrice - order.openPrice) * order.size;
			groups[order.symbol].size += order.size;
		});

		this.groupedOrders = Object.values(groups).map(group => {
			return {
				...group,
				openPrice: group.openPrice / group.orders.length,
				profit: group.profit / group.orders.length,
			};
		});
	}

	// Method to recalculate group-level data
	recalculateGroupData(group: OrderGroup) {
		group.openPrice = group.orders.reduce((sum, order) => sum + order.openPrice, 0) / group.orders.length;
		group.profit =
			group.orders.reduce((sum, order) => sum + (order.closePrice - order.openPrice) * order.size, 0) /
			group.orders.length;
		// Implement similar calculations for swap, size, etc., if needed
	}

	// Method to toggle showing orders
	toggleOrders(group: OrderGroup) {
		group.showOrders = !group.showOrders;
	}

	// Method to remove a group
	removeGroup(symbol: string) {
		const closedOrders = this.groupedOrders
			.filter(group => !group.showOrders)
			.map(group => group.orders.map(order => order.id))
			.flat();
		this.groupedOrders = this.groupedOrders.filter(group => group.symbol !== symbol);
		this._snackBar.open('Zamknięto zlecenia nr ' + closedOrders, 'OK', {
			duration: 2000,
		});
	}

	// Method to remove an order from a group
	removeOrder(event: { order: Order; group: OrderGroup }) {
		const { order, group } = event;
		group.orders = group.orders.filter(o => o !== order);
		if (group.orders.length === 0) {
			this.removeGroup(group.symbol);
		} else {
			this.recalculateGroupData(group);
		}
		this._snackBar.open('Zamknięto zlecenie nr ' + order.id, 'OK', { duration: 2000 });
	}
}
