import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SupabaseService } from '@zambia/data-access-supabase';
import { NotificationService } from '@zambia/data-access-generic';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TuiSkeleton, TuiBreadcrumbs } from '@taiga-ui/kit';
import { TuiIcon, TuiButton, TuiLink, TuiTextfield } from '@taiga-ui/core';
import { TuiItem } from '@taiga-ui/cdk';
import { UserMetadataService } from '@zambia/data-access-auth';
import { Database } from '@zambia/types-supabase';

type Agreement = Database['public']['Tables']['agreements']['Row'];
type Role = Database['public']['Tables']['roles']['Row'];
type Headquarter = Database['public']['Tables']['headquarters']['Row'];
type Season = Database['public']['Tables']['seasons']['Row'];

@Component({
  selector: 'z-profile',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    TuiButton,
    TuiSkeleton,
    TuiIcon,
    TuiLink,
    TuiBreadcrumbs,
    TuiItem,
    TuiTextfield,
  ],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-slate-800">
      <!-- Header Section -->
      <div class="border-b border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <div class="container mx-auto px-4 py-4 sm:px-6 sm:py-6">
          <!-- Breadcrumbs -->
          <tui-breadcrumbs class="mb-6">
            <a *tuiItem routerLink="/dashboard" tuiLink iconStart="@tui.house">
              {{ 'dashboard' | translate }}
            </a>
            <span *tuiItem>
              {{ 'profile.title' | translate }}
            </span>
          </tui-breadcrumbs>

          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <div class="mx-auto rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 p-4 shadow-lg sm:mx-0">
                <tui-icon icon="@tui.user" class="text-3xl text-white"></tui-icon>
              </div>
              <div>
                <h1 class="mb-1 text-2xl font-bold text-gray-800 sm:text-3xl dark:text-white">
                  {{ 'profile.title' | translate }}
                </h1>
                <p class="text-sm text-gray-600 sm:text-base dark:text-slate-400">
                  {{ 'profile.subtitle' | translate }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
        @if (isLoading()) {
          <!-- Loading State -->
          <div class="mb-8 grid grid-cols-1 gap-6">
            @for (i of [1, 2, 3, 4]; track i) {
              <div
                class="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900"
              >
                <div [tuiSkeleton]="true" class="mb-4 h-6 w-48"></div>
                <div class="space-y-3">
                  <div [tuiSkeleton]="true" class="h-10 w-full"></div>
                  <div [tuiSkeleton]="true" class="h-10 w-full"></div>
                </div>
              </div>
            }
          </div>
        } @else if (agreement()) {
          <!-- Profile Form -->
          <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="space-y-6">
            <!-- Personal Information Section -->
            <div
              class="rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:border-gray-300 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
            >
              <div class="mb-6 flex items-center gap-3">
                <div
                  class="rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-3 shadow-lg shadow-blue-500/25"
                >
                  <tui-icon icon="@tui.user" class="text-lg text-white"></tui-icon>
                </div>
                <div>
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                    {{ 'profile.personalInfo' | translate }}
                  </h2>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Información personal y de contacto</p>
                </div>
              </div>

              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <!-- First Name (Editable) -->
                <tui-textfield>
                  <label tuiLabel for="name">{{ 'profile.firstName' | translate }}</label>
                  <input
                    tuiTextfield
                    id="name"
                    type="text"
                    formControlName="name"
                    placeholder="{{ 'profile.firstName' | translate }}"
                  />
                </tui-textfield>

                <!-- Last Name (Editable) -->
                <tui-textfield>
                  <label tuiLabel for="lastName">{{ 'profile.lastName' | translate }}</label>
                  <input
                    tuiTextfield
                    id="lastName"
                    type="text"
                    formControlName="lastName"
                    placeholder="{{ 'profile.lastName' | translate }}"
                  />
                </tui-textfield>

                <!-- Document Number (Editable) -->
                <tui-textfield>
                  <label tuiLabel for="documentNumber">{{ 'profile.documentNumber' | translate }}</label>
                  <input
                    tuiTextfield
                    id="documentNumber"
                    type="text"
                    formControlName="documentNumber"
                    placeholder="{{ 'profile.documentNumber' | translate }}"
                  />
                </tui-textfield>

                <!-- Phone (Editable) -->
                <tui-textfield>
                  <label tuiLabel for="phone">{{ 'profile.phone' | translate }}</label>
                  <input
                    tuiTextfield
                    id="phone"
                    type="tel"
                    formControlName="phone"
                    placeholder="{{ 'profile.phone' | translate }}"
                  />
                </tui-textfield>

                <!-- Gender (Editable) -->
                <div>
                  <label for="gender" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ 'profile.gender' | translate }}
                  </label>
                  <select
                    id="gender"
                    formControlName="gender"
                    class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
                  >
                    <option value="">{{ 'profile.selectGender' | translate }}</option>
                    <option value="male">{{ 'profile.male' | translate }}</option>
                    <option value="female">{{ 'profile.female' | translate }}</option>
                  </select>
                </div>

                <!-- Birth Date (Editable) -->
                <tui-textfield>
                  <label tuiLabel for="birthDate">{{ 'profile.birthDate' | translate }}</label>
                  <input
                    tuiTextfield
                    id="birthDate"
                    type="date"
                    formControlName="birthDate"
                    placeholder="{{ 'profile.birthDate' | translate }}"
                  />
                </tui-textfield>

                <!-- Address (Editable - Full Width) -->
                <div class="md:col-span-2">
                  <tui-textfield>
                    <label tuiLabel for="address">{{ 'profile.address' | translate }}</label>
                    <input
                      tuiTextfield
                      id="address"
                      type="text"
                      formControlName="address"
                      placeholder="{{ 'profile.address' | translate }}"
                    />
                  </tui-textfield>
                </div>

                <!-- Email (Read-only) -->
                <tui-textfield>
                  <label tuiLabel for="email">{{ 'profile.email' | translate }}</label>
                  <input
                    tuiTextfield
                    id="email"
                    type="email"
                    formControlName="email"
                    readonly
                    [class.bg-gray-100]="true"
                    [class.dark:bg-gray-700]="true"
                  />
                </tui-textfield>

                <!-- Role (Read-only) -->
                <tui-textfield>
                  <label tuiLabel for="role">{{ 'profile.role' | translate }}</label>
                  <input
                    tuiTextfield
                    id="role"
                    type="text"
                    [value]="roleName()"
                    readonly
                    [class.bg-gray-100]="true"
                    [class.dark:bg-gray-700]="true"
                  />
                </tui-textfield>

                <!-- Headquarter (Read-only with link) -->
                <div>
                  <span class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ 'profile.headquarter' | translate }}
                  </span>
                  @if (headquarter()) {
                    <a
                      [routerLink]="['/dashboard/headquarters', headquarter()?.id || '']"
                      class="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                    >
                      <tui-icon icon="@tui.building-2" class="text-sm"></tui-icon>
                      {{ headquarter()?.name || '' }}
                    </a>
                  } @else {
                    <span class="text-gray-500 dark:text-gray-400">{{ 'profile.noHeadquarter' | translate }}</span>
                  }
                </div>

                <!-- Season (Read-only) -->
                <tui-textfield>
                  <label tuiLabel for="season">{{ 'profile.season' | translate }}</label>
                  <input
                    tuiTextfield
                    id="season"
                    type="text"
                    [value]="season()?.name || '-'"
                    readonly
                    [class.bg-gray-100]="true"
                    [class.dark:bg-gray-700]="true"
                  />
                </tui-textfield>

                <!-- Status (Read-only) -->
                <tui-textfield>
                  <label tuiLabel for="status">{{ 'profile.status' | translate }}</label>
                  <input
                    tuiTextfield
                    id="status"
                    type="text"
                    formControlName="status"
                    readonly
                    [class.bg-gray-100]="true"
                    [class.dark:bg-gray-700]="true"
                  />
                </tui-textfield>

                <!-- Activation Date (Read-only) -->
                <tui-textfield>
                  <label tuiLabel for="activationDate">{{ 'profile.activationDate' | translate }}</label>
                  <input
                    tuiTextfield
                    id="activationDate"
                    type="text"
                    formControlName="activationDate"
                    readonly
                    [class.bg-gray-100]="true"
                    [class.dark:bg-gray-700]="true"
                  />
                </tui-textfield>
              </div>
            </div>

            <!-- Agreement Consents Section -->
            <div
              class="rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:border-gray-300 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
            >
              <div class="mb-6 flex items-center gap-3">
                <div
                  class="rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 p-3 shadow-lg shadow-emerald-500/25"
                >
                  <tui-icon icon="@tui.file-text" class="text-lg text-white"></tui-icon>
                </div>
                <div>
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                    {{ 'profile.agreementConsents' | translate }}
                  </h2>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Consentimientos del acuerdo</p>
                </div>
              </div>

              <div class="space-y-4">
                <!-- Age Verification (Read-only) -->
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ 'profile.ageVerification' | translate }}
                  </span>
                  <tui-icon
                    [icon]="agreement()?.age_verification ? '@tui.check' : '@tui.x'"
                    [class.text-green-600]="agreement()?.age_verification"
                    [class.text-red-600]="!agreement()?.age_verification"
                  ></tui-icon>
                </div>

                <!-- Ethical Document Agreement (Read-only) -->
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ 'profile.ethicalDocumentAgreement' | translate }}
                  </span>
                  <tui-icon
                    [icon]="agreement()?.ethical_document_agreement ? '@tui.check' : '@tui.x'"
                    [class.text-green-600]="agreement()?.ethical_document_agreement"
                    [class.text-red-600]="!agreement()?.ethical_document_agreement"
                  ></tui-icon>
                </div>

                <!-- Mailing Agreement (Read-only) -->
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ 'profile.mailingAgreement' | translate }}
                  </span>
                  <tui-icon
                    [icon]="agreement()?.mailing_agreement ? '@tui.check' : '@tui.x'"
                    [class.text-green-600]="agreement()?.mailing_agreement"
                    [class.text-red-600]="!agreement()?.mailing_agreement"
                  ></tui-icon>
                </div>

                <!-- Volunteering Agreement (Read-only) -->
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ 'profile.volunteeringAgreement' | translate }}
                  </span>
                  <tui-icon
                    [icon]="agreement()?.volunteering_agreement ? '@tui.check' : '@tui.x'"
                    [class.text-green-600]="agreement()?.volunteering_agreement"
                    [class.text-red-600]="!agreement()?.volunteering_agreement"
                  ></tui-icon>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-4">
              <button type="button" tuiButton appearance="secondary" size="m" routerLink="/dashboard">
                {{ 'common.cancel' | translate }}
              </button>
              <button
                type="submit"
                tuiButton
                appearance="primary"
                size="m"
                [disabled]="isSaving() || profileForm.invalid"
              >
                @if (isSaving()) {
                  <tui-icon icon="@tui.loader" class="mr-2 animate-spin"></tui-icon>
                }
                {{ 'common.save' | translate }}
              </button>
            </div>
          </form>
        } @else {
          <!-- No Agreement Found -->
          <div
            class="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-lg dark:border-slate-700 dark:bg-slate-900"
          >
            <tui-icon icon="@tui.alert-circle" class="mb-4 text-4xl text-yellow-500"></tui-icon>
            <h3 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              {{ 'profile.noAgreementFound' | translate }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ 'profile.noAgreementDescription' | translate }}
            </p>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSmartComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private supabaseService = inject(SupabaseService);
  private notificationService = inject(NotificationService);
  private userMetadataService = inject(UserMetadataService);
  private translate = inject(TranslateService);

  protected isLoading: WritableSignal<boolean> = signal(true);
  protected isSaving: WritableSignal<boolean> = signal(false);
  protected agreement: WritableSignal<Agreement | null> = signal(null);
  protected role: WritableSignal<Role | null> = signal(null);
  protected headquarter: WritableSignal<Headquarter | null> = signal(null);
  protected season: WritableSignal<Season | null> = signal(null);

  protected roleName = signal<string>('');

  protected profileForm: FormGroup = this.fb.group({
    // Editable fields
    name: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    documentNumber: [''],
    phone: [''],
    gender: [''],
    birthDate: [null],
    address: [''],
    // Read-only fields
    email: [{ value: '', disabled: true }],
    status: [{ value: '', disabled: true }],
    activationDate: [{ value: '', disabled: true }],
  });

  async ngOnInit(): Promise<void> {
    await this.loadProfile();
  }

  private async loadProfile(): Promise<void> {
    try {
      this.isLoading.set(true);

      // Get user metadata
      const metadata = this.userMetadataService.userMetadata();
      if (!metadata.agreementId) {
        console.error('No agreement ID found in user metadata');
        this.isLoading.set(false);
        return;
      }

      // Load agreement data
      const { data: agreementData, error: agreementError } = await this.supabaseService
        .getClient()
        .from('agreements')
        .select('*')
        .eq('id', metadata.agreementId)
        .single();

      if (agreementError || !agreementData) {
        console.error('Error loading agreement:', agreementError);
        this.notificationService.showError(this.translate.instant('profile.loadError'));
        this.isLoading.set(false);
        return;
      }

      this.agreement.set(agreementData);

      // Load role data
      if (agreementData.role_id) {
        const { data: roleData } = await this.supabaseService
          .getClient()
          .from('roles')
          .select('*')
          .eq('id', agreementData.role_id)
          .single();

        if (roleData) {
          this.role.set(roleData);
          this.roleName.set(roleData.name);
        }
      }

      // Load headquarter data
      if (agreementData.headquarter_id) {
        const { data: hqData } = await this.supabaseService
          .getClient()
          .from('headquarters')
          .select('*')
          .eq('id', agreementData.headquarter_id)
          .single();

        if (hqData) {
          this.headquarter.set(hqData);
        }
      }

      // Load season data
      if (agreementData.season_id) {
        const { data: seasonData } = await this.supabaseService
          .getClient()
          .from('seasons')
          .select('*')
          .eq('id', agreementData.season_id)
          .single();

        if (seasonData) {
          this.season.set(seasonData);
        }
      }

      // Populate form with data
      this.profileForm.patchValue({
        // Editable fields
        name: agreementData.name || '',
        lastName: agreementData.last_name || '',
        documentNumber: agreementData.document_number || '',
        phone: agreementData.phone || '',
        gender: agreementData.gender || '',
        birthDate: agreementData.birth_date || null,
        address: agreementData.address || '',
        // Read-only fields
        email: agreementData.email || '',
        status: agreementData.status || '',
        activationDate: agreementData.activation_date
          ? new Date(agreementData.activation_date).toLocaleDateString()
          : '',
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      this.notificationService.showError(this.translate.instant('profile.loadError'));
    } finally {
      this.isLoading.set(false);
    }
  }

  protected async saveProfile(): Promise<void> {
    const currentAgreement = this.agreement();
    if (this.profileForm.invalid || !currentAgreement) return;

    try {
      this.isSaving.set(true);

      const formValue = this.profileForm.getRawValue();

      // Only update editable fields
      const updateData = {
        name: formValue.name,
        last_name: formValue.lastName,
        document_number: formValue.documentNumber,
        phone: formValue.phone,
        gender: formValue.gender,
        birth_date: formValue.birthDate || null,
        address: formValue.address,
        updated_at: new Date().toISOString(),
      };

      const { error } = await this.supabaseService
        .getClient()
        .from('agreements')
        .update(updateData)
        .eq('id', currentAgreement.id);

      if (error) {
        console.error('Error updating agreement:', error);
        this.notificationService.showError(this.translate.instant('profile.saveError'));
        return;
      }

      this.notificationService.showSuccess(this.translate.instant('profile.saveSuccess'));

      // Reload profile to get updated data
      await this.loadProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      this.notificationService.showError(this.translate.instant('profile.saveError'));
    } finally {
      this.isSaving.set(false);
    }
  }
}
