import { afterNextRender, computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export const enum AppTheme {
  LIGHT = 'light',
  DARK = 'dark',
}

const APP_THEME = 'theme';

function getStoredTheme(platformId: object): AppTheme | null {
  if (isPlatformBrowser(platformId)) {
    const storedValue = localStorage.getItem(APP_THEME);
    if (storedValue === AppTheme.LIGHT || storedValue === AppTheme.DARK) {
      return storedValue;
    }
  }
  return null;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);
  private isBrowser = isPlatformBrowser(this.platformId);

  private initialTheme = (() => {
    const stored = getStoredTheme(this.platformId);
    return stored === AppTheme.LIGHT ? AppTheme.LIGHT : AppTheme.DARK;
  })();

  currentTheme = signal<AppTheme>(this.initialTheme);
  isDarkTheme = computed(() => this.currentTheme() === AppTheme.DARK);

  constructor() {
    if (this.isBrowser) {
      this.applyInitialTheme();
    } else {
      console.log('this is ssr');
    }

    afterNextRender(() => {
      this.applyInitialTheme();
    });
  }

  private applyInitialTheme() {
    if (!this.isBrowser) return;

    if (this.initialTheme === AppTheme.DARK) {
      this.addClassToHtml('dark');
    } else {
      this.removeClassFromHtml('dark');
    }
  }

  setLightTheme() {
    if (!this.isBrowser) return;
    this.currentTheme.set(AppTheme.LIGHT);
    this.setToLocalStorage(AppTheme.LIGHT);
    this.removeClassFromHtml('dark');
  }

  setDarkTheme() {
    if (!this.isBrowser) return;
    this.currentTheme.set(AppTheme.DARK);
    this.setToLocalStorage(AppTheme.DARK);
    this.addClassToHtml('dark');
  }

  toggleTheme() {
    if (!this.isBrowser) return;

    if (this.currentTheme() === AppTheme.LIGHT) {
      this.setDarkTheme();
    } else {
      this.setLightTheme();
    }
  }

  private addClassToHtml(className: string) {
    if (this.isBrowser) {
      if (!this.document.documentElement.classList.contains(className)) {
        this.document.documentElement.classList.add(className);
      }
    }
  }

  private removeClassFromHtml(className: string) {
    if (this.isBrowser) {
      this.document.documentElement.classList.remove(className);
    }
  }

  private setToLocalStorage(theme: AppTheme) {
    if (this.isBrowser) {
      localStorage.setItem(APP_THEME, theme);
    }
  }
}
