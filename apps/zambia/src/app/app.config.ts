import type { ApplicationConfig } from '@angular/core';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideClientHydration, withIncrementalHydration } from '@angular/platform-browser';
import { provideTranslateService } from '@ngx-translate/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { environment } from '../environments/environment';
import { APP_CONFIG } from '@zambia/util-config';
import { provideEventPlugins } from '@taiga-ui/event-plugins';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: APP_CONFIG, useValue: environment },
    provideRouter(appRoutes, withComponentInputBinding()),
    provideClientHydration(withIncrementalHydration()),
    provideHttpClient(withFetch()),
    provideExperimentalZonelessChangeDetection(),
    provideTranslateService({
      defaultLanguage: 'es',
    }),
    provideAnimations(),
    provideEventPlugins(),
  ],
};
