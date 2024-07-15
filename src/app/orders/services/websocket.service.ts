import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
	providedIn: 'root',
})
export class WebSocketService {
	private socket$: WebSocketSubject<any>;

	constructor() {
		this.socket$ = new WebSocketSubject('wss://webquotes.geeksoft.pl/websocket/quotes');
	}

	// Method to get WebSocket subject
	getWebSocketSubject(): WebSocketSubject<any> {
		return this.socket$;
	}
}
