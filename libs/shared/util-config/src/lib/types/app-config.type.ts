import { InjectionToken } from '@angular/core';

export type AppConfigType = {
  API_URL: string;
  API_PUBLIC_KEY: string;
  PROD: false;
};

export const APP_CONFIG = new InjectionToken<AppConfigType>('Application config-environment');
