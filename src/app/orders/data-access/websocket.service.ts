import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import {map, Observable, tap} from "rxjs";

export type TMessage = {
  p: string;
  d: { s: string; b: number, a: number; t: number }[]
}

export type TPrice = {
  symbol: string;
  openPrice: number;
  closedPrice: number;
  timestamp: number;
}

@Injectable({
	providedIn: 'root',
})
export class PriceApiService {
	private socket$ = new WebSocketSubject<TMessage>('wss://webquotes.geeksoft.pl/websocket/quotes').pipe(
    tap({
      next: (message) => {
        console.log('WebSocket message received:', message);
      },
      error: (error: any) => console.error('WebSocket error:', error),
      complete: () => console.log('WebSocket connection closed')
    }),
  );

	getPrices(): Observable<TPrice[]> {
		return this.socket$.pipe(map((messages) => messages.d.map(price => ({
      symbol: price.s,
      openPrice: price.a,
      closedPrice: price.b,
      timestamp: price.t,
    }))));
	}
}
