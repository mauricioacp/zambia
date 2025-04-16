import { computed, inject, Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export const enum AppTheme {
  LIGHT = 'light',
  DARK = 'dark',
}

const CLIENT_RENDER = typeof localStorage !== 'undefined';

const APP_THEME = 'theme';

let selectedTheme: AppTheme | undefined = undefined;

if (CLIENT_RENDER) {
  selectedTheme = (localStorage.getItem(APP_THEME) as AppTheme) || undefined;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private document = inject(DOCUMENT);
  currentTheme = signal<AppTheme | undefined>(selectedTheme);
  isDarkTheme = computed(() => this.currentTheme() === AppTheme.DARK);
  private mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  constructor() {
    this.initializeTheme();
    this.setupSystemThemeListener();
  }

  private initializeTheme() {
    if (this.currentTheme() === undefined) {
      if (this.mediaQuery.matches) {
        this.addClassToHtml('dark');
      } else {
        this.removeClassFromHtml('dark');
      }
    } else {
      if (this.currentTheme() === AppTheme.DARK) {
        this.addClassToHtml('dark');
      } else {
        this.removeClassFromHtml('dark');
      }
    }
  }

  private setupSystemThemeListener() {
    if (CLIENT_RENDER) {
      this.mediaQuery.addEventListener('change', (e) => {
        if (this.currentTheme() === undefined) {
          if (e.matches) {
            this.addClassToHtml('dark');
          } else {
            this.removeClassFromHtml('dark');
          }
        }
      });
    }
  }

  setLightTheme() {
    this.currentTheme.set(AppTheme.LIGHT);
    this.setToLocalStorage(AppTheme.LIGHT);
    this.removeClassFromHtml('dark');
  }

  setDarkTheme() {
    this.currentTheme.set(AppTheme.DARK);
    this.setToLocalStorage(AppTheme.DARK);
    this.addClassToHtml('dark');
  }

  toggleTheme() {
    if (this.currentTheme() === AppTheme.LIGHT) {
      this.setDarkTheme();
    } else {
      this.setLightTheme();
    }
  }

  private addClassToHtml(className: string) {
    if (CLIENT_RENDER) {
      this.removeClassFromHtml(className);
      this.document.documentElement.classList.add(className);
    }
  }

  private removeClassFromHtml(className: string) {
    if (CLIENT_RENDER) {
      this.document.documentElement.classList.remove(className);
    }
  }

  private setToLocalStorage(theme: AppTheme) {
    if (CLIENT_RENDER) {
      localStorage.setItem(APP_THEME, theme);
    }
  }
}
