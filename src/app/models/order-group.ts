import { Order } from './order';

export interface OrderGroup {
	symbol: string;
	orders: Order[];
	openPrice: number;
	swap: number;
	profit: number;
	size: number;
	showOrders: boolean;
}
