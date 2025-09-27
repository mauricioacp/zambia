import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface StudentAgreementData {
  role: string;
  status: string;
  headquarterName: string;
  roleLabel?: string;
  statusLabel?: string;
  headquarterLabel?: string;
}

@Component({
  selector: 'z-student-agreement-card',
  imports: [],
  template: `
    <div
      class="group relative overflow-hidden rounded-2xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-gray-300/70 hover:shadow-xl hover:shadow-gray-900/10 dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20 dark:hover:border-slate-600/70 dark:hover:shadow-slate-900/40"
    >
      <!-- Gradient overlay on hover -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-slate-700/30"
      ></div>

      <div class="relative z-10">
        <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          <ng-content select="[title]"></ng-content>
        </h2>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="transition-transform duration-200 group-hover:translate-x-1">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ data().roleLabel || 'Role' }}
            </p>
            <p class="mt-1 font-medium text-gray-900 dark:text-white">
              {{ data().role }}
            </p>
          </div>
          <div class="transition-transform duration-200 group-hover:translate-x-1">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ data().statusLabel || 'Status' }}
            </p>
            <p class="mt-1 font-medium text-gray-900 dark:text-white">
              {{ data().status }}
            </p>
          </div>
          <div class="transition-transform duration-200 group-hover:translate-x-1">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ data().headquarterLabel || 'Headquarter' }}
            </p>
            <p class="mt-1 font-medium text-gray-900 dark:text-white">
              {{ data().headquarterName }}
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentAgreementCardUiComponent {
  readonly data = input.required<StudentAgreementData>();
}
