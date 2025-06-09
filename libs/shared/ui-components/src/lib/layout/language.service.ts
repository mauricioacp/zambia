import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import type { TuiCountryIsoCode } from '@taiga-ui/i18n';

export type Language = 'es' | 'en';

export interface LanguageOption {
  code: Language;
  name: string;
  flag: TuiCountryIsoCode;
}

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly translateService = inject(TranslateService);
  private readonly http = inject(HttpClient);

  readonly availableLanguages: LanguageOption[] = [
    { code: 'es', name: 'Español', flag: 'ES' },
    { code: 'en', name: 'English', flag: 'US' },
  ];

  readonly currentLanguage = signal<Language>('es');

  constructor() {
    this.initializeLanguages();
  }

  private initializeLanguages(): void {
    this.translateService.addLangs(['es', 'en']);
    this.translateService.setDefaultLang('es');
    this.loadTranslations();
  }

  private loadTranslations(): void {
    this.http.get('/i18n/es.json').subscribe((translations) => {
      this.translateService.setTranslation('es', translations);
      this.translateService.use('es');
    });

    this.http.get('/i18n/en.json').subscribe((translations) => {
      this.translateService.setTranslation('en', translations);
    });
  }

  changeLanguage(language: Language): void {
    this.currentLanguage.set(language);
    this.translateService.use(language);
  }

  getCurrentLanguageOption(): LanguageOption {
    return this.availableLanguages.find((lang) => lang.code === this.currentLanguage()) || this.availableLanguages[0];
  }
}
