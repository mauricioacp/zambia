import 'zone.js';
// eslint-disable-next-line @nx/enforce-module-boundaries
import 'apps/zambia/src/styles.css';

import { withThemeByClassName } from '@storybook/addon-themes';
import { moduleMetadata } from '@storybook/angular';
import { useDarkMode } from 'storybook-dark-mode';

export const decorators = [
  withThemeByClassName({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'light',
  }),
  moduleMetadata({}),
  (storyFn: () => unknown) => {
    const isDarkMode = useDarkMode();
    const documentElement = document.documentElement;
    const bodyElement = document.body;
    if (isDarkMode) {
      bodyElement.classList.add('dark');
      documentElement.classList.add('dark');
      bodyElement.classList.remove('light');
      documentElement.classList.remove('light');
    } else {
      bodyElement.classList.add('light');
      documentElement.classList.add('light');
      bodyElement.classList.remove('dark');
      documentElement.classList.remove('dark');
    }
    return storyFn();
  },
];
export const tags = ['autodocs'];
