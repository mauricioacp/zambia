import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import translationsEs from '../../public/i18n/es.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import translationsEn from '../../public/i18n/en.json';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly #translate = inject(TranslateService);

  constructor() {
    this.#translate.addLangs(['es', 'en']);
    this.#translate.setDefaultLang('es');
    this.#translate.use('es');
    this.#translate.setTranslation('es', {
      ...translationsEs,
      ...translationsEn,
    });
  }
}
