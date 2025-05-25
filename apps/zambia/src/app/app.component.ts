import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_CONFIG } from '@zambia/util-config';
import { TuiRoot } from '@taiga-ui/core';
import { ThemeService, CURRENT_THEME, IS_DARK_THEME, LanguageService } from '@zambia/ui-components';

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
  readonly config = inject(APP_CONFIG);
  readonly themeService = inject(ThemeService);
  readonly languageService = inject(LanguageService);

  constructor() {
    console.log(this.config.PROD ? 'PROD' : 'DEV');
  }
}
