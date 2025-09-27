import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

import { TuiIcon } from '@taiga-ui/core';

export type SectionHeaderVariant = 'default' | 'gradient' | 'minimal';
export type SectionHeaderIconColor = 'indigo' | 'sky' | 'emerald' | 'purple' | 'rose';

@Component({
  selector: 'z-section-header',
  standalone: true,
  imports: [TuiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [class]="sectionClasses()">
      <div [class]="containerClasses()">
        <div class="flex items-center gap-3">
          @if (showIcon()) {
            <div [class]="iconContainerClasses()">
              <tui-icon [icon]="icon()" class="!h-6 !w-6 text-white" />
            </div>
          }
          <div [class]="textContainerClasses()">
            <h2 [class]="titleClasses()">
              <ng-content select="[title]" />
            </h2>
            @if (showDescription()) {
              <p [class]="descriptionClasses()">
                <ng-content select="[description]" />
              </p>
            }
          </div>
        </div>
        @if (hasActions()) {
          <div class="mt-4 flex gap-2">
            <ng-content select="[actions]" />
          </div>
        }
      </div>
    </section>
  `,
  styles: ``,
})
export class SectionHeaderUiComponent {
  icon = input<string>('@tui.bar-chart');
  variant = input<SectionHeaderVariant>('default');
  iconColor = input<SectionHeaderIconColor>('indigo');
  showIcon = input<boolean>(true);
  showDescription = input<boolean>(true);
  hasActions = input<boolean>(false);
  compact = input<boolean>(false);

  sectionClasses = computed(() => {
    const base = this.compact() ? 'px-4 py-4 sm:px-6' : 'px-6 py-8 sm:px-8';
    return base;
  });

  containerClasses = computed(() => {
    const variant = this.variant();

    if (variant === 'minimal') {
      return '';
    }

    return 'mb-6';
  });

  iconContainerClasses = computed(() => {
    const variant = this.variant();
    const color = this.iconColor();

    const colorMap: Record<SectionHeaderIconColor, string> = {
      indigo: 'from-indigo-500 via-indigo-600 to-indigo-700 shadow-indigo-500/25',
      sky: 'from-sky-500 via-sky-600 to-sky-700 shadow-sky-500/25',
      emerald: 'from-emerald-500 via-emerald-600 to-emerald-700 shadow-emerald-500/25',
      purple: 'from-purple-500 via-purple-600 to-purple-700 shadow-purple-500/25',
      rose: 'from-rose-500 via-rose-600 to-rose-700 shadow-rose-500/25',
    };

    if (variant === 'gradient') {
      return `rounded-xl bg-gradient-to-br ${colorMap[color]} p-3 shadow-lg`;
    }

    if (variant === 'minimal') {
      return 'rounded-lg bg-gray-100 dark:bg-slate-700 p-2';
    }

    // default variant
    return 'rounded-lg bg-gradient-to-r ' + colorMap[color] + ' p-3';
  });

  textContainerClasses = computed(() => {
    return this.showIcon() ? '' : 'flex-1';
  });

  titleClasses = computed(() => {
    const variant = this.variant();
    const compact = this.compact();

    const sizeClass = compact ? 'text-xl font-semibold' : 'text-2xl font-bold';

    const colorClass = variant === 'minimal' ? 'text-gray-800 dark:text-gray-200' : 'text-gray-900 dark:text-white';

    return `${sizeClass} ${colorClass}`;
  });

  descriptionClasses = computed(() => {
    const variant = this.variant();

    return variant === 'minimal' ? 'text-sm text-gray-500 dark:text-gray-400' : 'text-gray-600 dark:text-gray-300';
  });
}
