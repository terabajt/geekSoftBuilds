import {Component, inject } from '@angular/core';
import {AsyncPipe, CommonModule} from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { TableHeaderComponent } from './table-header/table-header.component';
import { TableOrderComponent } from './table-order/table-order.component';
import {OrderService} from "../../data-access/order.service";
import {Order, OrderGroup} from '../../data-access/order.model';
import {ThemeService} from "../../../shared/theme/theme.service";

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
		TableOrderComponent,
    AsyncPipe
	],
	templateUrl: './order-list.component.html',
	styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent {
	public orderGroups$ = inject(OrderService).getOrdersBySymbol();
  public collapsedOrders: { [key: OrderGroup['symbol']]: boolean } = {}
	public darkThemeEnabled = inject(ThemeService).darkThemeEnabled();

	constructor(private orderService: OrderService) {}

  public showOrders(group: OrderGroup) {
    return !!this.collapsedOrders[group.symbol];
  }

	toggleOrders(group: OrderGroup) {
    this.collapsedOrders[group.symbol] = this.collapsedOrders[group.symbol] !== undefined ? !this.collapsedOrders[group.symbol] : true;
	}

	public removeGroup = (group: OrderGroup) => this.orderService.removeGroup(group);

  public removeOrder = ({ order }: { order: Order}) => this.orderService.removeOrder(order);
}
