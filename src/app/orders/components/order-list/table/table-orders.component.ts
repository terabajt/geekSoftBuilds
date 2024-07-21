import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Order } from '../../../../models/order';
import { OrderGroup } from '../../../../models/order-group';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
	selector: '[app-table-orders]',
	standalone: true,
	imports: [CommonModule, MatIconModule],
	template: `
		<td></td>
		<td>{{ order.id }}</td>
		<td>{{ order.side }}</td>
		<td>{{ order.size }}</td>
		<td>{{ order.openTime | date : 'dd.MM.yyyy HH:mm:ss' }}</td>
		<td>{{ order.openPrice }}</td>
		<td>{{ order.swap }}</td>
		<td>{{ order.profit ? order.profit.toFixed(2) : '0' }}</td>
		<td><mat-icon class="small-icon" (click)="onRemoveOrder()">delete</mat-icon></td>
	`,
})
export class TableOrdersComponent {
	@Input() order!: Order;
	@Input() group!: OrderGroup;
	@Output() removeOrder = new EventEmitter<{ order: Order; group: OrderGroup }>();

	onRemoveOrder() {
		this.removeOrder.emit({ order: this.order, group: this.group });
	}
}
