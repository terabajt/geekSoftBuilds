import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Order, OrderGroup} from '../../../data-access/order.model';
import {MatIconModule} from '@angular/material/icon';
import {DatePipe} from '@angular/common';

const dateFormat = 'dd.MM.yyyy HH:mm:ss';

@Component({
	selector: 'app-table-order',
	standalone: true,
  imports: [MatIconModule, DatePipe],
	templateUrl: './table-order.component.html',
  styleUrls: ['./table-order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableOrderComponent {
	@Input({ required: true }) public order!: Order;
	@Input({ required: true }) public group!: OrderGroup;
	@Output() public removeOrder = new EventEmitter<{ order: Order }>();
  public dateFormat = dateFormat;

  public orderRemoved() {
		this.removeOrder.emit({ order: this.order });
	}

  public formatPrice = (order: Order) => order.profit ? order.profit.toFixed(2) : '0'
}
