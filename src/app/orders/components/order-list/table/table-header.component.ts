import { Component } from '@angular/core';

@Component({
	selector: '[app-table-header]',
	standalone: true,
	template: `
		<tr>
			<th>Symbol</th>
			<th>Order ID</th>
			<th>Side</th>
			<th>Size</th>
			<th>Open Time</th>
			<th>Open Price</th>
			<th>Swap</th>
			<th>Profit</th>
			<th>Actions</th>
		</tr>
	`,
})
export class TableHeaderComponent {}
