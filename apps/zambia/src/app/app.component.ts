import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from '@zambia/util-config';
import { TuiRoot } from '@taiga-ui/core';
import { ThemeService, CURRENT_THEME, IS_DARK_THEME } from '@zambia/ui-components';

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
    {
      provide: IS_DARK_THEME,
      useFactory: () => {
        const themeService = inject(ThemeService);
        return themeService.isDarkTheme;
      },
    },
  ],
})
export class AppComponent {
  readonly #translate = inject(TranslateService);
  readonly #http = inject(HttpClient);
  readonly config = inject(APP_CONFIG);
  readonly themeService = inject(ThemeService);

  constructor() {
    this.#translate.addLangs(['es', 'en']);
    this.#translate.setDefaultLang('es');
    this.loadTranslations();
    console.log(this.config.PROD ? 'PROD' : 'DEV');
  }

  private loadTranslations(): void {
    this.#http.get('/i18n/es.json').subscribe((translations) => {
      this.#translate.setTranslation('es', translations);
      // eslint-disable-next-line rxjs/no-ignored-observable
      this.#translate.use('es');
    });

    this.#http.get('/i18n/en.json').subscribe((translations) => {
      this.#translate.setTranslation('en', translations);
    });
  }
}
