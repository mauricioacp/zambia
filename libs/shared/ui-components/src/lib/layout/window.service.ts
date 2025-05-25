import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type WindowSize = 'mobile' | 'tablet' | 'desktop';

@Injectable({
  providedIn: 'root',
})
export class WindowService {
  private breakpointObserver = inject(BreakpointObserver);
  private destroyRef = inject(DestroyRef);

  private windowSize = signal<WindowSize>('desktop');

  isMobile = computed(() => this.windowSize() === 'mobile');
  isTablet = computed(() => this.windowSize() === 'tablet');
  isDesktop = computed(() => this.windowSize() === 'desktop');

  size = computed(() => this.windowSize());

  constructor() {
    const customBreakpoints = {
      mobile: '(max-width: 767.98px)',
      tablet: '(min-width: 768px) and (max-width: 1023.98px)',
      desktop: '(min-width: 1024px)',
    };

    this.breakpointObserver
      .observe([customBreakpoints.mobile, customBreakpoints.tablet, customBreakpoints.desktop])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result.breakpoints[customBreakpoints.mobile]) {
          this.windowSize.set('mobile');
        } else if (result.breakpoints[customBreakpoints.tablet]) {
          this.windowSize.set('tablet');
        } else {
          this.windowSize.set('desktop');
        }
      });
  }
}
