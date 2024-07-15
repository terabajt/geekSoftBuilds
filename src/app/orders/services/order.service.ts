import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class OrderService {
	constructor(private http: HttpClient) {}
	getOrderData() {
		return this.http.get('https://geeksoft.pl/assets/order-data.json');
	}
}
