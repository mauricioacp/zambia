import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
// @ts-expect-error
import translationsEs from '../../public/i18n/es.json';
// @ts-expect-error
import translationsEn from '../../public/i18n/en.json';
import { APP_CONFIG } from '@zambia/util-config';
import { TuiRoot } from '@taiga-ui/core';
import { ThemeService } from '@zambia/ui-components';

@Component({
  imports: [RouterModule, TuiRoot],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './app.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly #translate = inject(TranslateService);
  readonly config = inject(APP_CONFIG);
  readonly themeService = inject(ThemeService);

  constructor() {
    this.#translate.addLangs(['es', 'en']);
    this.#translate.setDefaultLang('es');
    // eslint-disable-next-line rxjs/no-ignored-observable
    this.#translate.use('es');
    this.#translate.setTranslation('es', {
      ...translationsEs,
      ...translationsEn,
    });

    console.log(this.config.PROD ? 'PROD' : 'DEV');
  }
}
