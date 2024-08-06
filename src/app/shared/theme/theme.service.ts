import {computed, inject, Injectable, signal} from '@angular/core';
import {DOCUMENT} from "@angular/common";

@Injectable({
	providedIn: 'root',
})
export class ThemeService {
  public document = inject(DOCUMENT);
  public theme = signal<'dark-theme' | 'light-theme'>(this.getDefaultTheme())

  public darkThemeEnabled = () => computed(() => this.theme() === 'dark-theme');

  public lightThemeEnabled = () => computed(() => this.theme() === 'light-theme');

  public toggleTheme() {
    this.theme.update((theme) => theme === 'light-theme' ? 'dark-theme' : 'light-theme');
  }

  private getDefaultTheme() {
    const isDarkTheme = this.document.defaultView?.matchMedia && this.document.defaultView?.matchMedia('(prefers-color-scheme: dark)').matches;

    return isDarkTheme ? 'dark-theme' : 'light-theme' as const;
  };
}
