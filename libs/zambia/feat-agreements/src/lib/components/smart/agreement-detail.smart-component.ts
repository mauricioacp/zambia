import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AgreementsFacadeService } from '../../services/agreements-facade.service';

@Component({
  selector: 'z-agreement-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-6">
      <div class="mb-4">
        <a
          routerLink="/dashboard/agreements"
          class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          &larr; Back to Agreements
        </a>
      </div>

      @if (agreementsFacade.isDetailLoading()) {
        <div class="rounded-lg bg-white p-6 shadow-md dark:bg-slate-800">
          <div class="space-y-4">
            <div class="h-8 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div class="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div class="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div class="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      } @else if (agreementsFacade.agreementByIdResource()) {
        <div class="overflow-hidden rounded-lg bg-white shadow-md dark:bg-slate-800">
          <div class="border-b border-gray-200 px-6 py-5 dark:border-gray-700">
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white">Agreement Details</h3>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {{ agreementsFacade.agreementByIdResource()?.name }}
            </p>
          </div>
          <div class="border-t border-gray-200 dark:border-gray-700">
            <dl>
              <div class="grid grid-cols-3 gap-4 bg-gray-50 px-6 py-5 dark:bg-gray-900">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-300">Title</dt>
                <dd class="col-span-2 text-sm text-gray-900 dark:text-gray-100">
                  {{ agreementsFacade.agreementByIdResource()?.last_name }}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      } @else if (agreementsFacade.detailLoadingError()) {
        <div class="rounded border-l-4 border-red-400 bg-red-50 p-4 dark:border-red-500 dark:bg-red-900/30">
          <p class="text-red-700 dark:text-red-300">Error al cargar el acuerdo</p>
        </div>
      } @else {
        <div class="rounded border-l-4 border-red-400 bg-red-50 p-4 dark:border-red-500 dark:bg-red-900/30">
          <p class="text-red-700 dark:text-red-300">Acuerdo no encontrado.</p>
        </div>
      }
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgreementDetailSmartComponent {
  agreementsFacade = inject(AgreementsFacadeService);
  agreementId = input.required<string>();
}
