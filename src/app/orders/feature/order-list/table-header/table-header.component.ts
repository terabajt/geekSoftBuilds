import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'app-table-header',
	standalone: true,
	templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableHeaderComponent {}
