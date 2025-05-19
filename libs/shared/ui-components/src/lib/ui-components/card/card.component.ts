import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiIcon } from '@taiga-ui/core';

export interface CardColumnData {
  dataSubtitle: string;
  dataNumber: string | number;
}

function trimColData(colData: CardColumnData[]): CardColumnData[] {
  return colData.slice(0, 3);
}

@Component({
  selector: 'z-card',
  imports: [CommonModule, TuiIcon],
  template: `
    <div
      class="card-base bg-white shadow-md dark:bg-slate-800 dark:shadow-gray-900/30"
      [class.hover-gradient-border]="applyAnimatedBorder()"
      [ngClass]="
        applyAnimatedBorder()
          ? getBorderColorClass()
          : staticBorderColor() + ' ring-2 ring-offset-2 ring-offset-gray-100 dark:ring-offset-slate-900'
      "
    >
      <div>
        <div class="mb-4 flex items-start justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-slate-100">{{ mainTitle() }}</h3>
            <p class="text-xs text-gray-500 dark:text-slate-400">{{ mainSubtitle() }}</p>
          </div>
          <div class="stat-card-icon bg-gray-200 dark:bg-gray-700">
            <tui-icon
              [attr.aria-label]="icon() + ' icon'"
              [icon]="icon()"
              [style.background]="progressTextColor()"
              [style.color]="'white'"
              [style.font-size.rem]="2"
            />
          </div>
        </div>

        <div [class]="gridClass()">
          @for (col of colData(); track col.dataSubtitle) {
            <div>
              <p class="text-xs text-gray-500 dark:text-slate-400">{{ col.dataSubtitle }}</p>
              <p class="text-xl font-bold text-gray-800 dark:text-slate-100">{{ col.dataNumber }}</p>
            </div>
          }
        </div>
      </div>

      <div class="mt-auto">
        <div class="mb-1 flex justify-between text-xs text-gray-500 dark:text-slate-400">
          <span>Progreso</span>
          <span [ngClass]="progressTextColor()" class="font-semibold">{{ progressPercentage().toFixed(1) }}%</span>
        </div>
        <div class="h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
          <div [ngClass]="progressBarColor()" class="h-2.5 rounded-full" [style.width.%]="progressPercentage()"></div>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .card-base {
      padding: 1.25rem;
      border-radius: 0.85rem;
      box-shadow:
        0 10px 15px -3px rgba(0, 0, 0, 0.2),
        0 4px 6px -2px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.3s ease-in-out;
      position: relative;
      border: 3px solid transparent;
      background-clip: padding-box;
      z-index: 1;
      isolation: isolate;
      min-height: 220px;
    }

    .stat-card-icon {
      width: 2.75rem;
      height: 2.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.5rem;
    }

    /* Hover Gradient Border */
    .hover-gradient-border {
      position: relative;
      z-index: 1;
    }

    .hover-gradient-border::before {
      content: '';
      position: absolute;
      top: -2px;
      right: -2px;
      bottom: -2px;
      left: -2px;
      border-radius: 10px;
      background: transparent;
      z-index: -1;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .hover-gradient-border:hover::before {
      opacity: 1;
    }

    /* Border-only gradient styles */
    .border-sky:hover::before {
      background: linear-gradient(45deg, #0ea5e9, #38bdf8);
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      padding: 2px;
    }

    .border-green:hover::before {
      background: linear-gradient(45deg, #10b981, #34d399);
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      padding: 2px;
    }

    .border-purple:hover::before {
      background: linear-gradient(45deg, #8b5cf6, #a78bfa);
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      padding: 2px;
    }

    .border-yellow:hover::before {
      background: linear-gradient(45deg, #f59e0b, #fbbf24);
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      padding: 2px;
    }

    .border-pink:hover::before {
      background: linear-gradient(45deg, #ec4899, #f472b6);
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      padding: 2px;
    }

    .border-teal:hover::before {
      background: linear-gradient(45deg, #14b8a6, #2dd4bf);
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      padding: 2px;
    }

    .border-orange:hover::before {
      background: linear-gradient(45deg, #f97316, #fb923c);
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      padding: 2px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  mainTitle = input<string>('Default Title');
  mainSubtitle = input<string>('Default Subtitle');
  colData = input([], { transform: trimColData });

  progressPercentage = input<number>(0);
  progressBarColor = input<string>('bg-slate-500');
  progressTextColor = input<string>('text-slate-50');
  progressLabel = input<string>('Progress Label');

  icon = input<string>('');

  staticBorderColor = input<string>('ring-sky-500');
  applyAnimatedBorder = input<boolean>(true);

  gridClass = computed(() => {
    return `mb-4 grid grid-cols-${this.colData().length} gap-x-4 gap-y-2 text-sm`;
  });

  getBorderColorClass(): string {
    // Extract color from bg-{color}-{shade}
    const colorMatch = this.progressBarColor().match(/bg-(.*?)-\d+/);
    if (colorMatch && colorMatch[1]) {
      return `border-${colorMatch[1]}`;
    }
    return 'border-sky'; // Default
  }
}
