import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  model,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TuiAlertService, TuiButton, TuiIcon, TuiLoader, TuiTextfield } from '@taiga-ui/core';
import { TuiInputPhone } from '@taiga-ui/kit/components/input-phone';
import { TuiTextarea } from '@taiga-ui/kit/components/textarea';
import { ProfileService, UpdateProfilePayload, UserProfile } from '../../services/profile.service';

const PHONE_REGEX = /^\+?[1-9]\d{7,14}$/;

type EditableFieldKey = 'firstName' | 'lastName' | 'phoneNumber' | 'address' | 'bio';

interface EditableFields {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  bio: string;
}

@Component({
  selector: 'z-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    TuiLoader,
    TuiButton,
    TuiIcon,
    TuiTextfield,
    TuiInputPhone,
    TuiTextarea,
  ],
  template: `
    <div class="min-h-screen bg-gray-50 pb-16 dark:bg-slate-900">
      <section
        class="border-b border-slate-200 bg-white/90 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90"
      >
        <div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
          <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-4">
              <div class="rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 p-4 shadow-xl shadow-sky-500/30">
                <tui-icon icon="@tui.user" class="text-3xl text-white"></tui-icon>
              </div>
              <div>
                <p class="text-xs tracking-wide text-sky-600 uppercase dark:text-sky-400">
                  {{ 'profile.subtitle' | translate }}
                </p>
                <h1 class="text-3xl font-semibold text-slate-900 dark:text-white">
                  {{ headerName() }}
                </h1>
                @if (profile()) {
                  <p class="text-sm text-slate-500 dark:text-slate-300">{{ profile()?.email }}</p>
                }
              </div>
            </div>

            <a
              routerLink="/dashboard"
              class="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-medium text-sky-600 shadow-sm transition hover:border-sky-300 hover:text-sky-500 dark:border-sky-900/60 dark:bg-slate-900 dark:text-sky-400 dark:hover:border-sky-700"
            >
              <tui-icon icon="@tui.arrow-left" class="text-base"></tui-icon>
              {{ 'dashboard' | translate }}
            </a>
          </div>
        </div>
      </section>

      <section class="mx-auto mt-8 max-w-5xl px-4 sm:px-6 lg:px-8">
        @if (isLoading()) {
          <div class="flex h-72 items-center justify-center">
            <tui-loader size="l"></tui-loader>
          </div>
        } @else if (loadError()) {
          <div
            class="rounded-3xl border border-rose-200/80 bg-white/90 p-10 text-center shadow-2xl shadow-rose-200/40 dark:border-rose-900/60 dark:bg-slate-900/90 dark:shadow-rose-900/20"
          >
            <tui-icon icon="@tui.alert-triangle" class="mx-auto mb-4 text-4xl text-rose-500"></tui-icon>
            <h2 class="text-xl font-semibold text-slate-900 dark:text-white">{{ loadError() }}</h2>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-300">
              {{ 'profile.noAgreementDescription' | translate }}
            </p>
            <button
              type="button"
              tuiButton
              appearance="primary"
              class="mt-6"
              [disabled]="isSaving()"
              (click)="reloadProfile()"
            >
              {{ 'profile.retry' | translate }}
            </button>
          </div>
        } @else if (profile()) {
          <div class="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <form class="space-y-8" (submit)="onSubmit($event)">
              <div
                class="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-xl shadow-slate-200/50 backdrop-blur sm:p-8 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-slate-900/30"
              >
                <div class="mb-6 flex items-center gap-3">
                  <div class="rounded-xl bg-sky-600/90 p-3 shadow-lg shadow-sky-600/35 dark:bg-sky-500/90">
                    <tui-icon icon="@tui.edit-3" class="text-lg text-white"></tui-icon>
                  </div>
                  <div>
                    <h2 class="text-xl font-semibold text-slate-900 dark:text-white">
                      {{ 'profile.personalInfo' | translate }}
                    </h2>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                      {{ 'profile.subtitle' | translate }}
                    </p>
                  </div>
                </div>

                <div class="grid gap-6 sm:grid-cols-2">
                  <label class="flex flex-col gap-2">
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {{ 'profile.firstName' | translate }}
                    </span>
                    <input
                      tuiTextfield
                      type="text"
                      [ngModel]="firstName()"
                      (ngModelChange)="firstName.set($event)"
                      [ngModelOptions]="{ standalone: true }"
                      (blur)="markTouched('firstName')"
                      class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 transition outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
                      placeholder="{{ 'profile.firstName' | translate }}"
                      autocomplete="given-name"
                    />
                    @if (firstNameInvalid()) {
                      <p class="text-sm text-rose-500">
                        {{ 'profile.validation.firstNameRequired' | translate }}
                      </p>
                    }
                  </label>

                  <label class="flex flex-col gap-2">
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {{ 'profile.lastName' | translate }}
                    </span>
                    <input
                      tuiTextfield
                      type="text"
                      [ngModel]="lastName()"
                      (ngModelChange)="lastName.set($event)"
                      [ngModelOptions]="{ standalone: true }"
                      (blur)="markTouched('lastName')"
                      class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 transition outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
                      placeholder="{{ 'profile.lastName' | translate }}"
                      autocomplete="family-name"
                    />
                    @if (lastNameInvalid()) {
                      <p class="text-sm text-rose-500">
                        {{ 'profile.validation.lastNameRequired' | translate }}
                      </p>
                    }
                  </label>

                  <label class="flex flex-col gap-2 sm:col-span-2">
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {{ 'profile.phone' | translate }}
                    </span>
                    <input
                      tuiInputPhone
                      [ngModel]="phoneNumber()"
                      (ngModelChange)="phoneNumber.set($event)"
                      [ngModelOptions]="{ standalone: true }"
                      (blur)="markTouched('phoneNumber')"
                      class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 transition outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
                      placeholder="+541234567890"
                      autocomplete="tel"
                    />
                    @if (phoneInvalid()) {
                      <p class="text-sm text-rose-500">
                        {{ 'profile.validation.phoneInvalid' | translate }}
                      </p>
                    }
                  </label>

                  <label class="flex flex-col gap-2 sm:col-span-2">
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {{ 'profile.address' | translate }}
                    </span>
                    <input
                      tuiTextfield
                      type="text"
                      [ngModel]="address()"
                      (ngModelChange)="address.set($event)"
                      [ngModelOptions]="{ standalone: true }"
                      (blur)="markTouched('address')"
                      class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 transition outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
                      placeholder="{{ 'profile.address' | translate }}"
                      autocomplete="street-address"
                    />
                  </label>

                  <label class="flex flex-col gap-2 sm:col-span-2">
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {{ 'profile.bio' | translate }}
                    </span>
                    <textarea
                      tuiTextarea
                      rows="4"
                      [ngModel]="bio()"
                      (ngModelChange)="bio.set($event)"
                      [ngModelOptions]="{ standalone: true }"
                      (blur)="markTouched('bio')"
                      class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 transition outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
                      placeholder="{{ 'profile.bio' | translate }}"
                    ></textarea>
                  </label>
                </div>
              </div>

              <div class="flex flex-col gap-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  tuiButton
                  appearance="secondary"
                  class="w-full sm:w-auto"
                  [disabled]="isSaving()"
                  routerLink="/dashboard"
                >
                  {{ 'profile.cancel' | translate }}
                </button>
                <button
                  type="submit"
                  tuiButton
                  appearance="primary"
                  class="w-full sm:w-auto"
                  [disabled]="saveDisabled()"
                >
                  @if (isSaving()) {
                    <span class="flex items-center gap-2">
                      <tui-loader size="s" [overlay]="false"></tui-loader>
                      {{ 'profile.save' | translate }}
                    </span>
                  } @else {
                    {{ 'profile.save' | translate }}
                  }
                </button>
              </div>
            </form>

            <aside class="space-y-8">
              <div
                class="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-xl shadow-slate-200/50 backdrop-blur sm:p-8 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-slate-900/30"
              >
                <div class="mb-6 flex items-center gap-3">
                  <div class="rounded-xl bg-emerald-500/90 p-3 shadow-lg shadow-emerald-500/35">
                    <tui-icon icon="@tui.id-card" class="text-lg text-white"></tui-icon>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
                      {{ 'profile.agreementInfo' | translate }}
                    </h3>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                      {{ 'profile.personalInfo' | translate }}
                    </p>
                  </div>
                </div>

                <dl class="space-y-4">
                  <div class="flex items-start justify-between gap-6">
                    <dt class="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {{ 'profile.documentNumber' | translate }}
                    </dt>
                    <dd class="text-sm font-semibold text-slate-900 dark:text-white">
                      {{ profile()?.dni || ('not_specified' | translate) }}
                    </dd>
                  </div>

                  <div class="flex items-start justify-between gap-6">
                    <dt class="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {{ 'profile.email' | translate }}
                    </dt>
                    <dd class="text-sm font-semibold break-all text-slate-900 dark:text-white">
                      {{ profile()?.email || ('not_specified' | translate) }}
                    </dd>
                  </div>

                  <div class="flex items-start justify-between gap-6">
                    <dt class="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {{ 'profile.role' | translate }}
                    </dt>
                    <dd class="text-sm font-semibold text-slate-900 dark:text-white">
                      {{ profile()?.role || ('no_role' | translate) }}
                    </dd>
                  </div>

                  <div class="flex items-start justify-between gap-6">
                    <dt class="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {{ 'profile.season' | translate }}
                    </dt>
                    <dd class="text-sm font-semibold text-slate-900 dark:text-white">
                      {{ profile()?.season || ('no_seasons_found' | translate) }}
                    </dd>
                  </div>

                  <div class="flex items-start justify-between gap-6">
                    <dt class="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {{ 'profile.headquarter' | translate }}
                    </dt>
                    <dd class="text-sm font-semibold text-slate-900 dark:text-white">
                      {{ profile()?.headquarter || ('profile.noHeadquarter' | translate) }}
                    </dd>
                  </div>
                </dl>
              </div>
            </aside>
          </div>
        }
      </section>
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
export class ProfileSmartComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly translate = inject(TranslateService);
  private readonly alertService = inject(TuiAlertService);

  protected readonly isLoading = signal(true);
  protected readonly isSaving = signal(false);
  protected readonly loadError = signal<string | null>(null);
  protected readonly profile = signal<UserProfile | null>(null);

  protected readonly firstName = model('');
  protected readonly lastName = model('');
  protected readonly phoneNumber = model('');
  protected readonly address = model('');
  protected readonly bio = model('');

  private readonly originalData = signal<EditableFields | null>(null);
  private readonly submitted = signal(false);
  protected readonly touched: Record<EditableFieldKey, WritableSignal<boolean>> = {
    firstName: signal(false),
    lastName: signal(false),
    phoneNumber: signal(false),
    address: signal(false),
    bio: signal(false),
  };

  protected readonly headerName = computed(() => {
    const current = this.profile();
    if (!current) {
      return this.translate.instant('profile.title');
    }

    const fullName = `${current.firstName} ${current.lastName}`.trim();
    return fullName.length ? fullName : this.translate.instant('profile.title');
  });

  protected readonly firstNameInvalid = computed(() => {
    if (!(this.touched.firstName() || this.submitted())) {
      return false;
    }

    return !this.firstName().trim();
  });

  protected readonly lastNameInvalid = computed(() => {
    if (!(this.touched.lastName() || this.submitted())) {
      return false;
    }

    return !this.lastName().trim();
  });

  protected readonly phoneInvalid = computed(() => {
    if (!(this.touched.phoneNumber() || this.submitted())) {
      return false;
    }

    return !PHONE_REGEX.test(this.phoneNumber().trim());
  });

  protected readonly isFormInvalid = computed(() => {
    if (!this.firstName().trim()) {
      return true;
    }

    if (!this.lastName().trim()) {
      return true;
    }

    return !PHONE_REGEX.test(this.phoneNumber().trim());
  });

  protected readonly hasChanges = computed(() => {
    const original = this.originalData();
    if (!original) {
      return false;
    }

    return (
      original.firstName !== this.firstName().trim() ||
      original.lastName !== this.lastName().trim() ||
      original.phoneNumber !== this.phoneNumber().trim() ||
      original.address !== this.address().trim() ||
      original.bio !== this.bio().trim()
    );
  });

  protected readonly saveDisabled = computed(() => this.isSaving() || this.isFormInvalid() || !this.hasChanges());

  async ngOnInit(): Promise<void> {
    await this.loadProfileInternal();
  }

  protected async reloadProfile(): Promise<void> {
    await this.loadProfileInternal();
  }

  protected markTouched(field: EditableFieldKey): void {
    this.touched[field].set(true);
  }

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    await this.saveProfile();
  }

  private async loadProfileInternal(): Promise<void> {
    this.isLoading.set(true);
    this.loadError.set(null);

    try {
      const currentProfile = await this.profileService.getProfile();
      this.profile.set(currentProfile);
      this.applyEditableFields(currentProfile);
    } catch (error) {
      console.error('[ProfileSmartComponent] Failed to load profile', error);
      const message = this.translate.instant('profile.loadError');
      this.loadError.set(message);
      this.alertService.open(message, { appearance: 'negative', autoClose: 4000 }).subscribe();
    } finally {
      this.isLoading.set(false);
    }
  }

  private applyEditableFields(profile: UserProfile): void {
    const sanitized: EditableFields = {
      firstName: profile.firstName.trim(),
      lastName: profile.lastName.trim(),
      phoneNumber: profile.phoneNumber.trim(),
      address: profile.address.trim(),
      bio: profile.bio.trim(),
    };

    this.firstName.set(sanitized.firstName);
    this.lastName.set(sanitized.lastName);
    this.phoneNumber.set(sanitized.phoneNumber);
    this.address.set(sanitized.address);
    this.bio.set(sanitized.bio);

    this.originalData.set(sanitized);
    this.submitted.set(false);
    this.resetTouched();
  }

  private resetTouched(): void {
    Object.values(this.touched).forEach((state) => state.set(false));
  }

  private async saveProfile(): Promise<void> {
    this.submitted.set(true);
    this.markTouched('firstName');
    this.markTouched('lastName');
    this.markTouched('phoneNumber');

    if (this.isFormInvalid()) {
      this.alertService
        .open(this.translate.instant('profile.validation.formInvalid'), {
          appearance: 'negative',
          autoClose: 4000,
        })
        .subscribe();
      return;
    }

    this.isSaving.set(true);

    const payload: UpdateProfilePayload = {
      firstName: this.firstName().trim(),
      lastName: this.lastName().trim(),
      phoneNumber: this.phoneNumber().trim(),
      address: this.address().trim(),
      bio: this.bio().trim(),
    };

    try {
      await this.profileService.updateProfile(payload);
      const updatedProfile = await this.profileService.getProfile();
      this.profile.set(updatedProfile);
      this.applyEditableFields(updatedProfile);

      this.alertService
        .open(this.translate.instant('profile.saveSuccess'), {
          appearance: 'positive',
          autoClose: 3000,
        })
        .subscribe();
    } catch (error) {
      console.error('[ProfileSmartComponent] Failed to save profile', error);
      this.alertService
        .open(this.translate.instant('profile.saveError'), {
          appearance: 'negative',
          autoClose: 4000,
        })
        .subscribe();
    } finally {
      this.isSaving.set(false);
    }
  }
}
