import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AgreementDetails, AgreementsFacadeService } from '../../services/agreements-facade.service';
import { TuiSkeleton } from '@taiga-ui/kit';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TuiIcon } from '@taiga-ui/core';
import { ICONS } from '@zambia/util-constants';

interface TableRow {
  key: string;
  value: string | number | boolean | null | undefined;
  translationKey: string;
}

@Component({
  selector: 'z-agreement-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TuiSkeleton, NgClass, TranslatePipe, TuiIcon],
  template: `
    <div class="w-full bg-gray-50 p-6 dark:bg-gray-900">
      <div class="mb-4">
        <a
          routerLink="/dashboard/agreements"
          class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          &larr; {{ 'back.to.agreements' | translate }}
        </a>
      </div>

      @if (agreementsFacade.isDetailLoading()) {
        <div class="rounded-lg bg-white p-6 shadow-md dark:bg-slate-800">
          <div class="space-y-4">
            <div [tuiSkeleton]="true" class="h-8 w-1/2"></div>
            <div [tuiSkeleton]="true" class="h-4 w-full"></div>
            <div [tuiSkeleton]="true" class="h-4 w-full"></div>
            <div [tuiSkeleton]="true" class="h-4 w-full"></div>
          </div>
        </div>
      } @else if (agreementData()) {
        <!-- Page Headings: With Details and Actions -->
        <div class="mb-8 flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
          <!-- Heading -->
          <div>
            <h2 class="mb-2 text-2xl font-extrabold md:text-3xl">
              {{ agreementData()!.name }} {{ agreementData()!.last_name }}
            </h2>
            <ul
              class="inline-flex list-none flex-wrap items-center justify-center gap-3 text-sm font-medium text-gray-600 md:justify-start dark:text-gray-400"
            >
              <li class="inline-flex items-center gap-1.5">
                <tui-icon [icon]="ICONS.USERS" class="opacity-50"></tui-icon>
                <span>{{ 'agreement' | translate }}</span>
              </li>
              @if (agreementData()!.roles?.name) {
                <li class="inline-flex items-center gap-1.5">
                  <tui-icon [icon]="ICONS.LEADER" class="opacity-50"></tui-icon>
                  <span>{{ agreementData()!.roles?.name }} ({{ agreementData()!.roles?.code }})</span>
                </li>
              }
              @if (agreementData()!.headquarters?.name) {
                <li class="inline-flex items-center gap-1.5">
                  <tui-icon [icon]="ICONS.HEADQUARTERS" class="opacity-50"></tui-icon>
                  <span>{{ agreementData()!.headquarters?.name }}</span>
                </li>
              }
              <li class="inline-flex items-center gap-1.5">
                <tui-icon [icon]="'tuiIconActivity'" class="opacity-50"></tui-icon>
                <span
                  class="inline-flex rounded-full px-2 text-xs leading-5 font-semibold"
                  [ngClass]="
                    agreementData()!.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : agreementData()!.status === 'graduated'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                  "
                >
                  {{ agreementData()!.status || '' | translate }}
                </span>
              </li>
              @if (agreementData()!.seasons?.name) {
                <li class="inline-flex items-center gap-1.5">
                  <tui-icon [icon]="'tuiIconCalendar'" class="opacity-50"></tui-icon>
                  <span>{{ 'season' | translate }}: {{ agreementData()!.seasons?.name }}</span>
                </li>
              }
            </ul>
          </div>
          <!-- END Heading -->

          <!-- Actions -->
          <div class="flex flex-none flex-wrap items-center justify-center gap-2 sm:justify-end">
            <button
              type="button"
              class="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-gray-800 hover:border-gray-300 hover:text-gray-900 hover:shadow-xs focus:ring-3 focus:ring-gray-300/25 active:border-gray-200 active:shadow-none dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600/40 dark:active:border-gray-700"
            >
              <tui-icon [icon]="'pencil'" class="opacity-50"></tui-icon>
              <span>{{ 'edit' | translate }}</span>
            </button>
          </div>
          <!-- END Actions -->
        </div>
        <!-- END Page Headings: With Details and Actions -->

        <!-- Personal Information -->
        <div class="mb-6">
          <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
            {{ 'personal.information' | translate }}
          </h3>
        </div>

        <!-- Agreement Information -->
        <div class="mb-6">
          <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
            {{ 'agreement.information' | translate }}
          </h3>
        </div>

        <!-- Location Information -->
        <div class="mb-6">
          <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
            {{ 'location.information' | translate }}
          </h3>
        </div>
      } @else if (agreementsFacade.detailLoadingError()) {
        <div class="rounded border-l-4 border-red-400 bg-red-50 p-4 dark:border-red-500 dark:bg-red-900/30">
          <p class="text-red-700 dark:text-red-300">
            {{ 'failed.to.load.agreement' | translate }}: {{ agreementsFacade.detailLoadingError() }}
          </p>
        </div>
      } @else {
        <div class="rounded border-l-4 border-red-400 bg-red-50 p-4 dark:border-red-500 dark:bg-red-900/30">
          <p class="text-red-700 dark:text-red-300">{{ 'agreement.not.found' | translate }}</p>
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgreementDetailSmartComponent {
  agreementsFacade = inject(AgreementsFacadeService);
  translate = inject(TranslateService);
  agreementId = input.required<string>();
  agreementData: WritableSignal<AgreementDetails | null> = signal(null);
  ICONS = ICONS;

  constructor() {
    effect(() => {
      this.agreementsFacade.agreementId.set(this.agreementId());
      this.agreementsFacade.loadAgreementById();
    });

    effect(() => {
      this.agreementData.set(this.agreementsFacade.agreementByIdResource());
    });
  }

  personalInformation = computed<TableRow[]>(() => {
    const data = this.agreementData();
    if (!data) return [];

    return [
      { key: 'email', value: data.email, translationKey: 'email' },
      { key: 'phone', value: data.phone, translationKey: 'phone' },
      { key: 'document_number', value: data.document_number, translationKey: 'document.number' },
      { key: 'birth_date', value: data.birth_date, translationKey: 'birth.date' },
      { key: 'gender', value: data.gender, translationKey: 'gender' },
      { key: 'address', value: data.address, translationKey: 'address' },
    ];
  });

  agreementInformation = computed<TableRow[]>(() => {
    const data = this.agreementData();
    if (!data) return [];

    return [
      { key: 'ethical_document_agreement', value: data.ethical_document_agreement, translationKey: 'ethical.document' },
      { key: 'mailing_agreement', value: data.mailing_agreement, translationKey: 'mailing.agreement' },
      { key: 'volunteering_agreement', value: data.volunteering_agreement, translationKey: 'volunteering.agreement' },
      { key: 'age_verification', value: data.age_verification, translationKey: 'age.verification' },
      { key: 'created_at', value: data.created_at, translationKey: 'created.at' },
    ];
  });

  locationInformation = computed<TableRow[]>(() => {
    const data = this.agreementData();
    if (!data) return [];

    return [
      { key: 'headquarter', value: data.headquarters?.name, translationKey: 'headquarter' },
      { key: 'country', value: data.headquarters?.countries?.name, translationKey: 'country' },
      { key: 'role', value: data.roles?.name, translationKey: 'role' },
      { key: 'season', value: data.seasons?.name, translationKey: 'season' },
    ];
  });
}
