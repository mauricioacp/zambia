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

  setSystemTheme() {
    this.currentTheme.set(undefined);
    this.removeFromLocalStorage();
    if (isSystemDark()) {
      this.addClassToHtml('dark');
    } else {
      this.removeClassFromHtml('dark');
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
  private removeFromLocalStorage() {
    if (CLIENT_RENDER) {
      localStorage.removeItem(APP_THEME);
    }
  }
}
function isSystemDark() {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } else {
    return false;
  }
}
