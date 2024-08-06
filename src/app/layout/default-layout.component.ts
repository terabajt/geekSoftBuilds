import {Component, inject } from '@angular/core';
import {MatSlideToggle } from '@angular/material/slide-toggle';
import {RouterOutlet} from "@angular/router";

import {ThemeService} from "../shared/theme/theme.service";

@Component({
	selector: 'app-default-layout',
	standalone: true,
  imports: [
    MatSlideToggle,
    RouterOutlet
  ],
	templateUrl: './default-layout.component.html',
	styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent {
  private themeService = inject(ThemeService)
  public lightThemeEnabled = this.themeService.lightThemeEnabled();

	public toggleTheme = () => this.themeService.toggleTheme();
}
