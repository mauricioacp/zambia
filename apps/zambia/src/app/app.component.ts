import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_CONFIG } from '@zambia/util-config';
import { TuiRoot } from '@taiga-ui/core';
import { ThemeService, CURRENT_THEME, LanguageService } from '@zambia/ui-components';

@Component({
  imports: [RouterModule, TuiRoot],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './app.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: CURRENT_THEME,
      useFactory: () => {
        const themeService = inject(ThemeService);
        return themeService.currentTheme;
      },
    },
  ],
})
export class AppComponent {
  readonly config = inject(APP_CONFIG);
  readonly themeService = inject(ThemeService);
  // early initialization is necessary todo check if we can do it in providers
  private readonly languageService = inject(LanguageService);

  constructor() {
    console.log(this.config.PROD ? 'PROD' : 'DEV');
    if (this.config.PROD) {
      console.log = function () {
        /* empty */
      };
      console.warn = function () {
        /* empty */
      };
      console.error = function () {
        /* empty */
      };
      console.info = function () {
        /* empty */
      };
    }
    /* todo Sentry.init({
      dsn: 'https://ea4ca286152e4285a573932511600fff@glitchtip-q00soko4s8gkck4sos4ww8s8.cappady.com/1',
      tracesSampleRate: 0.01,
    });*/

    // Sentry.captureException(new Error('Test error'));
  }
}
