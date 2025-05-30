import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RoleService } from '@zambia/data-access-roles-permissions';
import { SupabaseService } from '@zambia/data-access-supabase';
import { NotificationService } from '@zambia/data-access-generic';
import { TranslateModule } from '@ngx-translate/core';
import { TuiSkeleton } from '@taiga-ui/kit';
import { TuiIcon, TuiButton } from '@taiga-ui/core';

interface Headquarter {
  id: string;
  name: string;
}

@Component({
  selector: 'z-profile',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, TuiButton, TuiSkeleton, TuiIcon],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-slate-900">
      <!-- Header Section -->
      <div class="relative overflow-hidden">
        <!-- Background Glow -->
        <div
          class="absolute inset-0 -inset-x-6 rounded-3xl bg-gradient-to-r from-purple-300 via-blue-500 to-indigo-700 opacity-10 blur-2xl"
        ></div>

        <!-- Glass Header Container -->
        <div
          class="relative rounded-2xl bg-white/40 p-2.5 ring-1 ring-gray-200/50 backdrop-blur-sm dark:bg-gray-500/20 dark:ring-gray-700/60"
        >
          <div
            class="rounded-xl bg-white/95 p-6 shadow-xl shadow-gray-900/5 dark:bg-gray-950/95 dark:shadow-slate-900/20"
          >
            <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 class="mb-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                  {{ 'profile.title' | translate }}
                </h1>
                <p class="text-lg text-gray-600 dark:text-gray-300">
                  {{ 'profile.subtitle' | translate }}
                </p>
              </div>

              <!-- Back Button -->
              <button tuiButton appearance="secondary" size="m" (click)="goBack()" [attr.aria-label]="'Volver'">
                <tui-icon icon="@tui.arrow-left" class="mr-2"></tui-icon>
                Volver
              </button>
            </div>
          </div>
        </div>
      </div>

      @if (isLoading()) {
        <!-- Loading State -->
        <div class="px-6 py-8 sm:px-8">
          <div class="mx-auto max-w-4xl space-y-6">
            @for (i of [1, 2, 3]; track i) {
              <div class="h-32 w-full rounded-2xl bg-white/40 backdrop-blur-sm" [tuiSkeleton]="true"></div>
            }
          </div>
        </div>
      } @else {
        <!-- Profile Form -->
        <div class="px-6 py-8 sm:px-8">
          <div class="mx-auto max-w-4xl">
            <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="space-y-8">
              <!-- Personal Information Section -->
              <div
                class="rounded-2xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20"
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
                    <p class="text-sm text-gray-600 dark:text-gray-400">Información básica de tu cuenta</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <!-- First Name -->
                  <div>
                    <label for="firstName" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ 'profile.firstName' | translate }}
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      formControlName="firstName"
                      class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
                      placeholder="{{ 'profile.firstName' | translate }}"
                    />
                  </div>

                  <!-- Last Name -->
                  <div>
                    <label for="lastName" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ 'profile.lastName' | translate }}
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      formControlName="lastName"
                      class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
                      placeholder="{{ 'profile.lastName' | translate }}"
                    />
                  </div>

                  <!-- Email (readonly) -->
                  <div>
                    <label for="email" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ 'profile.email' | translate }}
                    </label>
                    <input
                      id="email"
                      type="email"
                      formControlName="email"
                      readonly
                      class="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-300"
                      placeholder="{{ 'profile.email' | translate }}"
                    />
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">El email no se puede modificar</p>
                  </div>

                  <!-- Phone -->
                  <div>
                    <label for="phone" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ 'profile.phone' | translate }}
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      formControlName="phone"
                      class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
                      placeholder="{{ 'profile.phone' | translate }}"
                    />
                  </div>

                  <!-- Position -->
                  <div>
                    <label for="position" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ 'profile.position' | translate }}
                    </label>
                    <input
                      id="position"
                      type="text"
                      formControlName="position"
                      class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
                      placeholder="{{ 'profile.position' | translate }}"
                    />
                  </div>

                  <!-- Headquarter -->
                  <div>
                    <label for="headquarterId" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ 'profile.headquarter' | translate }}
                    </label>
                    <select
                      id="headquarterId"
                      formControlName="headquarterId"
                      class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
                    >
                      <option value="">Seleccionar sede</option>
                      @for (headquarter of headquarters(); track headquarter.id) {
                        <option [value]="headquarter.id">{{ headquarter.name }}</option>
                      }
                    </select>
                  </div>
                </div>
              </div>

              <!-- Agreement Information Section -->
              <div
                class="rounded-2xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20"
              >
                <div class="mb-6 flex items-center gap-3">
                  <div
                    class="rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 p-3 shadow-lg shadow-emerald-500/25"
                  >
                    <tui-icon icon="@tui.file-text" class="text-lg text-white"></tui-icon>
                  </div>
                  <div>
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                      {{ 'profile.agreementInfo' | translate }}
                    </h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Información de tu acuerdo organizacional</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <!-- Agreement Type -->
                  <div>
                    <label for="agreementType" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ 'profile.agreementType' | translate }}
                    </label>
                    <select
                      id="agreementType"
                      formControlName="agreementType"
                      class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
                    >
                      <option value="">Seleccionar tipo</option>
                      <option value="companion">Acompañante</option>
                      <option value="facilitator">Facilitador</option>
                      <option value="coordinator">Coordinador</option>
                      <option value="manager">Gerente</option>
                      <option value="director">Director</option>
                    </select>
                  </div>

                  <!-- Agreement Start Date -->
                  <div>
                    <label for="agreementStartDate" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ 'profile.agreementStartDate' | translate }}
                    </label>
                    <input
                      id="agreementStartDate"
                      type="date"
                      formControlName="agreementStartDate"
                      class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
                    />
                  </div>

                  <!-- Agreement Status -->
                  <div>
                    <label for="agreementStatus" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ 'profile.agreementStatus' | translate }}
                    </label>
                    <select
                      id="agreementStatus"
                      formControlName="agreementStatus"
                      class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
                    >
                      <option value="">Seleccionar estado</option>
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                      <option value="pending">Pendiente</option>
                      <option value="completed">Completado</option>
                    </select>
                  </div>
                </div>

                <!-- Role (readonly) -->
                <div class="mt-6">
                  <label for="role" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Rol Organizacional</label
                  >
                  <input
                    id="role"
                    type="text"
                    formControlName="role"
                    readonly
                    class="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-300"
                    placeholder="Rol Organizacional"
                  />
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">El rol es asignado por administradores</p>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex justify-end gap-4">
                <button type="button" tuiButton appearance="secondary" size="m" (click)="goBack()">Cancelar</button>
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
                  {{ 'profile.save' | translate }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
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
  private roleService = inject(RoleService);
  private supabaseService = inject(SupabaseService);
  private notificationService = inject(NotificationService);

  protected isLoading: WritableSignal<boolean> = signal(true);
  protected isSaving: WritableSignal<boolean> = signal(false);
  protected headquarters: WritableSignal<Headquarter[]> = signal([]);

  protected profileForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    position: [''],
    headquarterId: [''],
    agreementType: [''],
    agreementStartDate: [''],
    agreementStatus: [''],
    role: [''],
  });

  async ngOnInit(): Promise<void> {
    await this.loadProfile();
    await this.loadHeadquarters();
  }

  private async loadProfile(): Promise<void> {
    try {
      this.isLoading.set(true);

      const {
        data: { user },
        error: userError,
      } = await this.supabaseService.getClient().auth.getUser();

      if (userError || !user) {
        this.router.navigate(['/auth']);
        return;
      }

      // Get user metadata
      const userMetadata = user.user_metadata || {};

      // Try to get profile data from agreements table (assuming this is where user data is stored)
      const { data: profileData, error } = await this.supabaseService
        .getClient()
        .from('agreements')
        .select('*')
        .eq('email', user.email || '')
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned
        console.error('Error loading profile:', error);
        this.notificationService.showError('Error al cargar el perfil');
        return;
      }

      // Populate form with available data
      this.profileForm.patchValue({
        firstName: profileData?.name || userMetadata['firstName'] || '',
        lastName: profileData?.last_name || userMetadata['lastName'] || '',
        email: user.email || '',
        phone: profileData?.phone || userMetadata['phone'] || '',
        position: userMetadata['position'] || '',
        headquarterId: profileData?.headquarter_id || userMetadata['headquarterId'] || '',
        agreementType: userMetadata['agreementType'] || '',
        agreementStartDate: profileData?.activation_date || userMetadata['agreementStartDate'] || '',
        agreementStatus: profileData?.status || userMetadata['agreementStatus'] || '',
        role: userMetadata['role'] || 'No asignado',
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      this.notificationService.showError('Error al cargar el perfil');
    } finally {
      this.isLoading.set(false);
    }
  }

  private async loadHeadquarters(): Promise<void> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('headquarters')
        .select('id, name')
        .eq('status', 'active')
        .order('name');

      if (error) {
        console.error('Error loading headquarters:', error);
        return;
      }

      this.headquarters.set(data || []);
    } catch (error) {
      console.error('Error loading headquarters:', error);
    }
  }

  protected async saveProfile(): Promise<void> {
    if (this.profileForm.invalid) return;

    try {
      this.isSaving.set(true);

      const {
        data: { user },
        error: userError,
      } = await this.supabaseService.getClient().auth.getUser();

      if (userError || !user) return;

      const formValue = this.profileForm.value;

      // Update user metadata in auth
      const { error: metadataError } = await this.supabaseService.getClient().auth.updateUser({
        data: {
          firstName: formValue.firstName,
          lastName: formValue.lastName,
          phone: formValue.phone,
          position: formValue.position,
          headquarterId: formValue.headquarterId,
          agreementType: formValue.agreementType,
          agreementStartDate: formValue.agreementStartDate,
          agreementStatus: formValue.agreementStatus,
        },
      });

      if (metadataError) {
        console.error('Error updating user metadata:', metadataError);
        this.notificationService.showError('Error al actualizar el perfil');
        return;
      }

      this.notificationService.showSuccess('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error saving profile:', error);
      this.notificationService.showError('Error al guardar el perfil');
    } finally {
      this.isSaving.set(false);
    }
  }

  protected goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
