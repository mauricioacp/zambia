import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideClientHydration, withIncrementalHydration } from '@angular/platform-browser';
import { provideTranslateService } from '@ngx-translate/core';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withComponentInputBinding()),
    provideClientHydration(withIncrementalHydration()),
    provideHttpClient(withFetch()),
    provideExperimentalZonelessChangeDetection(),
    provideTranslateService({
      defaultLanguage: 'es',
    }),
  ],
};
