import { afterNextRender, computed, inject, Injectable, InjectionToken, PLATFORM_ID, signal } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { TUI_DARK_MODE } from '@taiga-ui/core';

export const enum AppTheme {
  LIGHT = 'light',
  DARK = 'dark',
}

const APP_THEME = 'theme';

export const CURRENT_THEME = new InjectionToken<() => AppTheme>('Current Theme Signal');
export const IS_DARK_THEME = new InjectionToken<() => boolean>('Is Dark Theme Signal');

export function injectCurrentTheme() {
  return inject(CURRENT_THEME);
}

export function injectIsDarkTheme() {
  return inject(IS_DARK_THEME);
}

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

  /* private readonly key = inject(TUI_DARK_MODE_KEY);
  private readonly storage = inject(WA_LOCAL_STORAGE);
  private readonly media = inject(WA_WINDOW).matchMedia('(prefers-color-scheme: dark)');*/
  protected readonly darkMode = inject(TUI_DARK_MODE);

  constructor() {
    if (this.isBrowser) {
      this.applyInitialTheme();
    } else {
      console.log('this is ssr');
    }

    afterNextRender(() => {
      this.applyInitialTheme();
      this.darkMode.set(true);
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
