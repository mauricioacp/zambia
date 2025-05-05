import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
// @ts-expect-error
import translationsEs from '../../public/i18n/es.json';
// @ts-expect-error
import translationsEn from '../../public/i18n/en.json';
import { APP_CONFIG } from '@zambia/util-config';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly #translate = inject(TranslateService);
  readonly config = inject(APP_CONFIG);

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
