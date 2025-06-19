import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type GlowColor = 'blue' | 'purple' | 'emerald' | 'pink' | 'orange' | 'multicolor';

@Component({
  selector: 'z-glass-container',
  imports: [CommonModule],
  template: `
    <div class="relative overflow-hidden" [ngClass]="containerClass()">
      <!-- Background Glow -->
      @if (showGlow()) {
        <div
          class="absolute inset-0 -inset-x-6 -inset-y-6 animate-pulse rounded-3xl opacity-40 blur-3xl"
          [ngClass]="getGlowClass()"
        ></div>
      }

      <!-- Glass Container -->
      <div
        class="relative z-10 rounded-2xl bg-white/40 p-2.5 ring-1 ring-gray-200/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/50 hover:ring-gray-300/70 dark:bg-gray-500/20 dark:ring-gray-700/60 dark:hover:bg-gray-500/30 dark:hover:ring-gray-600/70"
      >
        <div
          class="rounded-xl bg-white/95 shadow-xl shadow-gray-900/5 transition-shadow duration-300 hover:shadow-2xl hover:shadow-gray-900/10 dark:bg-gray-950/95 dark:shadow-slate-900/20 dark:hover:shadow-slate-900/40"
          [ngClass]="innerClass()"
        >
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlassContainerUiComponent {
  readonly showGlow = input<boolean>(true);
  readonly glowColor = input<GlowColor>('multicolor');
  readonly containerClass = input<string>('');
  readonly innerClass = input<string>('p-6');

  protected getGlowClass(): string {
    const glowClasses: Record<GlowColor, string> = {
      blue: 'bg-gradient-to-r from-blue-300 via-blue-500 to-blue-700',
      purple: 'bg-gradient-to-r from-purple-300 via-purple-500 to-purple-700',
      emerald: 'bg-gradient-to-r from-emerald-300 via-emerald-500 to-emerald-700',
      pink: 'bg-gradient-to-r from-pink-300 via-pink-500 to-pink-700',
      orange: 'bg-gradient-to-r from-orange-300 via-orange-500 to-orange-700',
      multicolor: 'bg-gradient-to-r from-blue-300 via-teal-500 to-blue-700',
    };
    return glowClasses[this.glowColor()] || glowClasses.multicolor;
  }
}
