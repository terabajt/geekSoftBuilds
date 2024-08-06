export interface Order {
	id: number;
	symbol: string;
	side: string;
	size: number;
	openTime: number;
	openPrice: number;
	swap: number;
	closePrice: number;
	profit: number;
}

export interface OrderGroup {
  symbol: string;
  orders: Order[];
  openPrice: number;
  swap: number;
  profit: number;
  size: number;
}
