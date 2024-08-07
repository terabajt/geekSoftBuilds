import { Routes } from '@angular/router';

import { OrderListComponent } from './orders/feature/order-list/order-list.component';

export const routes: Routes = [
	{ path: 'orders', component: OrderListComponent },
	{ path: '', redirectTo: '/orders', pathMatch: 'full' },
];
