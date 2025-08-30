import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface QuickActionData {
  title: string;
  description: string;
  icon: string;
  route?: string;
  action?: string;
  color: 'sky' | 'emerald' | 'purple' | 'orange' | 'pink';
}

@Component({
  selector: 'z-quick-action-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (data().route) {
      <a
        [routerLink]="data().route"
        class="group relative block overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-lg hover:shadow-{{
          colorClass()
        }}-500/10 dark:bg-slate-800"
      >
        <ng-container *ngTemplateOutlet="cardContent"></ng-container>
      </a>
    } @else {
      <button
        (click)="data().action && actionClicked.emit(data().action!)"
        class="group relative w-full overflow-hidden rounded-xl bg-white p-6 text-left shadow-sm transition-all duration-200 hover:shadow-lg hover:shadow-{{
          colorClass()
        }}-500/10 dark:bg-slate-800"
      >
        <ng-container *ngTemplateOutlet="cardContent"></ng-container>
      </button>
    }

    <ng-template #cardContent>
      <div class="flex items-center gap-4">
        <div
          class="rounded-lg bg-gradient-to-r p-3"
          [ngClass]="{
            'from-sky-500 to-sky-600': data().color === 'sky',
            'from-emerald-500 to-emerald-600': data().color === 'emerald',
            'from-purple-500 to-purple-600': data().color === 'purple',
            'from-orange-500 to-orange-600': data().color === 'orange',
            'from-pink-500 to-pink-600': data().color === 'pink',
          }"
        >
          <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" stroke-width="2">
            <path [attr.d]="data().icon" />
          </svg>
        </div>
        <div class="flex-1">
          <h3
            class="font-semibold text-gray-900 transition-colors group-hover:text-{{
              colorClass()
            }}-600 dark:text-white dark:group-hover:text-{{ colorClass() }}-400"
          >
            {{ data().title }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            {{ data().description }}
          </p>
        </div>
        <svg
          class="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1 dark:text-gray-500"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </ng-template>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickActionCardComponent {
  data = input.required<QuickActionData>();
  actionClicked = output<string>();

  colorClass() {
    return this.data().color;
  }
}
