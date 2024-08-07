import { Component } from '@angular/core';
import {DefaultLayoutComponent} from "./layout/default-layout.component";

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [DefaultLayoutComponent],
	templateUrl: './app.component.html',
})
export class AppComponent {}
