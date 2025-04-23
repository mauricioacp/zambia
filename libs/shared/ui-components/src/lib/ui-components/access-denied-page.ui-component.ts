import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { logoSvg } from '../assets/logo-svg';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { map, Subscription, take, timer } from 'rxjs';

@Component({
  selector: 'z-access-denied-page',
  imports: [CommonModule, RouterLink],
  template: ` <div class="flex h-full items-center justify-center p-4 align-middle">
    <div class="w-full max-w-md space-y-6 rounded-lg bg-slate-50 p-8 text-center shadow-xl">
      <div class="flex justify-center text-slate-700" [innerHTML]="safeSvg"></div>

      <h1 class="text-3xl font-bold text-slate-800">Acceso Denegado</h1>

      <p class="text-lg text-[#90a1b9]">Lo sentimos, no tienes permiso para acceder a esta página.</p>

      <div class="text-base text-slate-600">
        <p>
          Serás redirigido a la página de inicio en
          <span class="font-semibold text-slate-800">{{ countdown }}</span> segundos...
        </p>
      </div>

      <a
        routerLink="/dashboard"
        class="inline-block rounded-md bg-slate-700 px-6 py-2 text-sm font-medium text-white transition duration-150 ease-in-out hover:bg-slate-600 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:outline-none"
      >
        Ir a Inicio Ahora
      </a>
    </div>
  </div>`,
  styles: `
    :host {
      display: block;
      width: 100%;
      min-height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessDeniedPageUiComponent implements OnInit, OnDestroy {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly initialCountdownSeconds = 20000000;
  countdown = this.initialCountdownSeconds;

  private countdownSubscription: Subscription | null = null;

  readonly safeSvg = this.sanitizer.bypassSecurityTrustHtml(logoSvg);

  ngOnInit(): void {
    this.startCountdown();
  }

  ngOnDestroy(): void {
    this.countdownSubscription?.unsubscribe();
  }

  private startCountdown(): void {
    this.countdownSubscription = timer(0, 1000)
      .pipe(
        map((i) => this.initialCountdownSeconds - i), // Calculate remaining seconds
        take(this.initialCountdownSeconds + 1) // Take N+1 emissions (e.g., 20 down to 0)
      )
      .subscribe({
        next: (remainingSeconds) => {
          this.countdown = remainingSeconds;
          this.cdr.markForCheck();
        },
        complete: () => {
          this.redirectToHome();
        },
      });
  }

  redirectToHome(): void {
    if (this.countdownSubscription && !this.countdownSubscription.closed) {
      this.countdownSubscription.unsubscribe();
    }
    this.router.navigate(['/dashboard']);
  }
}
