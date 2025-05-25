import type { ApplicationConfig } from '@angular/core';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions, withInMemoryScrolling } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideClientHydration, withIncrementalHydration } from '@angular/platform-browser';
import { provideTranslateService } from '@ngx-translate/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { environment } from '../environments/environment';
import { APP_CONFIG } from '@zambia/util-config';
import { provideEventPlugins } from '@taiga-ui/event-plugins';
import { provideAnimations } from '@angular/platform-browser/animations';
import { USER_ROLE_TOKEN } from '@zambia/util-roles-permissions';
import { RoleService } from '@zambia/data-access-roles-permissions';
import { TUI_LANGUAGE, TUI_SPANISH_LANGUAGE } from '@taiga-ui/i18n';
import { of } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: APP_CONFIG, useValue: environment },
    provideRouter(
      appRoutes, 
      withComponentInputBinding(), 
      withViewTransitions(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled'
      })
    ),
    provideClientHydration(withIncrementalHydration()),
    provideHttpClient(withFetch()),
    provideExperimentalZonelessChangeDetection(),
    provideTranslateService({
      defaultLanguage: 'es',
    }),
    provideAnimations(),
    provideEventPlugins(),
    {
      provide: USER_ROLE_TOKEN,
      useFactory: (roleService: RoleService) => () => roleService.userRole(),
      deps: [RoleService],
    },
    {
      provide: TUI_LANGUAGE,
      useValue: of(TUI_SPANISH_LANGUAGE),
    },
  ],
};
