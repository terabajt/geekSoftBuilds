import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map, Observable} from "rxjs";
import {Order} from "./order.model";

@Injectable({
	providedIn: 'root',
})
export class OrderApiService {
	constructor(private http: HttpClient) {}

	getOrderData(): Observable<Order[]> {
		return this.http.get<{ data: Order[] }>('https://geeksoft.pl/assets/order-data.json').pipe(map((data) => data.data));
	}
}
