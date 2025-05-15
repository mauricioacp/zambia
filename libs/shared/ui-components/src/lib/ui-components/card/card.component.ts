import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CardColumnData {
  dataSubtitle: string;
  dataNumber: string | number;
}

function trimColData(colData: CardColumnData[]): CardColumnData[] {
  console.warn('CardComponent: colData should not exceed 3 items. Truncating.');
  return colData.slice(0, 3);
}

@Component({
  selector: 'z-card',
  imports: [CommonModule],
  template: `
    <div
      class="card-base"
      [class.card-item]="applyHoverScale()"
      [ngClass]="staticBorderColor() ? [staticBorderColor(), 'ring-2', 'ring-offset-2', 'ring-offset-slate-900'] : []"
    >
      <div>
        <div class="mb-4 flex items-start justify-between">
          <div>
            <h3 class="text-lg font-semibold text-slate-100">{{ mainTitle() }}</h3>
            <p class="text-xs text-slate-400">{{ mainSubtitle() }}</p>
          </div>
          <div class="stat-card-icon">taiga icon</div>
        </div>

        <div [class]="gridClass()">
          @for (col of colData(); track col.dataSubtitle) {
            <div>
              <p class="text-xs text-slate-400">{{ col.dataSubtitle }}</p>
              <p class="text-xl font-bold text-slate-100">{{ col.dataNumber }}</p>
            </div>
          }
        </div>
      </div>

      <div class="mt-auto">
        <div class="mb-1 flex justify-between text-xs text-slate-400">
          <span>Progreso</span>
          <span [ngClass]="progressTextColor()" class="font-semibold">{{ progressPercentage().toFixed(1) }}%</span>
        </div>
        <div class="h-2.5 w-full overflow-hidden rounded-full bg-slate-700">
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
      background-color: #1e293b;
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

    .card-item:hover {
      transform: scale(1.01);
    }

    .stat-card-icon {
      width: 2.75rem;
      height: 2.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.5rem;
      background-color: #334155;
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
  applyHoverScale = input<boolean>(true);

  gridClass = computed(() => {
    return `mb-4 grid grid-cols-${this.colData().length} gap-x-4 gap-y-2 text-sm`;
  });
}
