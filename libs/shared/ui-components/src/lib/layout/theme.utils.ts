import { computed } from '@angular/core';
import { injectCurrentTheme, injectIsDarkTheme, AppTheme } from './theme.service';

/**
 * Theme utility functions for common theme-based operations
 */

/**
 * Returns theme-specific CSS classes
 * @param lightClass - CSS class for light theme
 * @param darkClass - CSS class for dark theme
 * @returns Signal that returns the appropriate class
 */
export function themeClass(lightClass: string, darkClass: string) {
  const isDark = injectIsDarkTheme();
  return computed(() => (isDark() ? darkClass : lightClass));
}

/**
 * Returns theme-specific values
 * @param lightValue - Value for light theme
 * @param darkValue - Value for dark theme
 * @returns Signal that returns the appropriate value
 */
export function themeValue<T>(lightValue: T, darkValue: T) {
  const isDark = injectIsDarkTheme();
  return computed(() => (isDark() ? darkValue : lightValue));
}

/**
 * Checks if current theme matches the specified theme
 * @param theme - Theme to check against
 * @returns Signal that returns true if current theme matches
 */
export function isTheme(theme: AppTheme) {
  const currentTheme = injectCurrentTheme();
  return computed(() => currentTheme() === theme);
}

/**
 * Returns the opposite theme
 * @returns Signal that returns the opposite theme
 */
export function oppositeTheme() {
  const currentTheme = injectCurrentTheme();
  return computed(() => (currentTheme() === AppTheme.LIGHT ? AppTheme.DARK : AppTheme.LIGHT));
}
