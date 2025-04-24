# Angular v19 Supabase Services Documentation

## Table of Contents

- [Overview](#overview)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
  - [SupabaseService](#supabaseservice)
  - [AgreementService](#agreementservice)
  - [CountryService](#countryservice)
  - [AuthService](#authservice)
- [Usage Examples](#usage-examples)
  - [SupabaseService Examples](#supabaseservice-examples)
  - [AgreementService Examples](#agreementservice-examples)
  - [CountryService Examples](#countryservice-examples)
  - [AuthService Examples](#authservice-examples)
- [Edge Cases & Limitations](#edge-cases--limitations)
- [Advanced Scenarios](#advanced-scenarios)
- [Troubleshooting](#troubleshooting)

## Overview

This library provides a set of Angular v19 services for interacting with Supabase, a Firebase alternative built on PostgreSQL. These services offer a robust, type-safe interface for authentication, data access, and state management in Angular applications.

The services are designed to work together to provide a complete solution for Supabase integration:

- **SupabaseService**: Core service that initializes and provides access to the Supabase client
- **AgreementService**: Manages agreements and their associated roles
- **CountryService**: Handles country data with efficient caching
- **AuthService**: Manages authentication, sessions, and role-based access control

These services leverage Angular's latest features including signals, computed properties, and injection tokens to provide a modern, reactive approach to state management and data access.

### Prerequisites

- Angular v19 or higher
- Supabase project and API credentials
- RxJS knowledge for working with observables

## Installation & Setup

### 1. Install Required Packages

```bash
npm install @supabase/supabase-js
```

### 2. Configure Environment Variables

Create or update your environment files with Supabase credentials:

```typescript
// environment.ts
export const environment = {
  production: false,
  supabaseUrl: 'YOUR_SUPABASE_URL',
  supabaseKey: 'YOUR_SUPABASE_PUBLIC_KEY',
};
```

### 3. Set Up Configuration Provider

Create a configuration provider:

```typescript
// app.config.ts
import { ApplicationConfig, InjectionToken } from '@angular/core';
import { environment } from './environments/environment';

export interface AppConfig {
  API_URL: string;
  API_PUBLIC_KEY: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_CONFIG,
      useValue: {
        API_URL: environment.supabaseUrl,
        API_PUBLIC_KEY: environment.supabaseKey,
      } as AppConfig,
    },
  ],
};
```

### 4. Import Services in Your Module or Component

```typescript
// app.component.ts
import { Component, inject } from '@angular/core';
import { SupabaseService, AgreementService, CountryService } from '@zambia/data-access-supabase';
import { AuthService } from '@zambia/data-access-auth';

@Component({
  selector: 'app-root',
  template: `<div>App works!</div>`,
})
export class AppComponent {
  private supabaseService = inject(SupabaseService);
  private agreementService = inject(AgreementService);
  private countryService = inject(CountryService);
  private authService = inject(AuthService);

  // Now you can use these services
}
```

## API Documentation

### SupabaseService

The core service that initializes and provides access to the Supabase client.

#### Properties

| Property  | Type                    | Description                                      |
| --------- | ----------------------- | ------------------------------------------------ |
| `loading` | `Signal<boolean>`       | Signal indicating if an operation is in progress |
| `error`   | `Signal<Error \| null>` | Signal containing the current error state        |

#### Methods

##### `getClient()`

Returns the initialized Supabase client instance.

- **Return Type**: `SupabaseClient<Database>`
- **Description**: Provides access to the raw Supabase client for direct API calls

##### `resetError()`

Resets the error signal to null.

- **Return Type**: `void`
- **Description**: Clears any error that was previously set

#### Protected Methods

These methods are intended for use by services that extend SupabaseService:

##### `startOperation()`

- **Return Type**: `void`
- **Description**: Sets loading to true and clears errors

##### `handleSuccess()`

- **Return Type**: `void`
- **Description**: Sets loading to false and clears errors

##### `handleError(error: Error | PostgrestError, context = 'Operation')`

- **Parameters**:
  - `error`: The error that occurred
  - `context`: Optional context string for error logging
- **Return Type**: `void`
- **Description**: Handles errors, logs them, and updates the error signal

##### `wrapObservableOperation<T>(operation$: Observable<T>, context = 'Operation')`

- **Parameters**:
  - `operation$`: The observable operation to wrap
  - `context`: Optional context string for error logging
- **Return Type**: `Observable<T>`
- **Description**: Wraps an observable operation with loading and error handling

##### `wrapAsyncOperation<T>(operationPromise: Promise<T>, context = 'Operation')`

- **Parameters**:
  - `operationPromise`: The promise to wrap
  - `context`: Optional context string for error logging
- **Return Type**: `Promise<T | null>`
- **Description**: Wraps a promise with loading and error handling

##### `handleResponse<T>(response: { data: T | null; error: PostgrestError | null }, context = 'Fetch')`

- **Parameters**:
  - `response`: The Supabase response object
  - `context`: Optional context string for error logging
- **Return Type**: `T`
- **Description**: Handles Supabase responses and throws errors if present
- **Throws**: `PostgrestError` if the response contains an error

### AgreementService

Service for managing agreements and their associated roles.

#### Properties

| Property            | Type                          | Description                                            |
| ------------------- | ----------------------------- | ------------------------------------------------------ |
| `selectedAgreement` | `Computed<Agreement \| null>` | Computed property for the currently selected agreement |

#### Methods

##### `getAgreements(status?: AgreementStatus, headquarterId?: string, seasonId?: string)`

Retrieves agreements with optional filters.

- **Parameters**:
  - `status`: Optional status filter
  - `headquarterId`: Optional headquarter filter
  - `seasonId`: Optional season filter
- **Return Type**: `Observable<Agreement[]>`
- **Description**: Fetches agreements matching the specified filters

##### `getAgreementById(id: string)`

Retrieves a specific agreement by ID.

- **Parameters**:
  - `id`: The agreement ID
- **Return Type**: `Observable<Agreement | null>`
- **Description**: Fetches a single agreement by its ID

##### `getAgreementsWithRoles()`

Retrieves agreements with their associated roles.

- **Return Type**: `Observable<AgreementWithRoles[]>`
- **Description**: Fetches agreements with their roles, with caching for performance

##### `getAgreementsByRole(roleId: string)`

Retrieves agreements by role ID.

- **Parameters**:
  - `roleId`: The role ID
- **Return Type**: `Observable<AgreementWithRoles[]>`
- **Description**: Fetches agreements associated with a specific role

##### `createAgreement(agreement: AgreementInsert)`

Creates a new agreement.

- **Parameters**:
  - `agreement`: The agreement data to insert
- **Return Type**: `Observable<Agreement | null>`
- **Description**: Creates a new agreement and updates the local state

##### `updateAgreement(id: string, updates: AgreementUpdate)`

Updates an existing agreement.

- **Parameters**:
  - `id`: The agreement ID
  - `updates`: The fields to update
- **Return Type**: `Observable<Agreement | null>`
- **Description**: Updates an agreement and refreshes the local state

##### `deleteAgreement(id: string)`

Deletes an agreement.

- **Parameters**:
  - `id`: The agreement ID
- **Return Type**: `Observable<boolean>`
- **Description**: Deletes an agreement and updates the local state

##### `addRoleToAgreement(agreementId: string, roleId: string)`

Adds a role to an agreement.

- **Parameters**:
  - `agreementId`: The agreement ID
  - `roleId`: The role ID
- **Return Type**: `Observable<boolean>`
- **Description**: Associates a role with an agreement

##### `removeRoleFromAgreement(agreementId: string, roleId: string)`

Removes a role from an agreement.

- **Parameters**:
  - `agreementId`: The agreement ID
  - `roleId`: The role ID
- **Return Type**: `Observable<boolean>`
- **Description**: Removes a role association from an agreement

##### `invalidateCache()`

Invalidates the agreements with roles cache.

- **Return Type**: `void`
- **Description**: Forces a refresh of cached data on next request

##### `setSelectedAgreement(id: string | null)`

Sets the selected agreement ID.

- **Parameters**:
  - `id`: The agreement ID or null
- **Return Type**: `void`
- **Description**: Updates the selected agreement signal

##### `toViewModel(agreements: Agreement[])`

Converts agreements to view models.

- **Parameters**:
  - `agreements`: Array of agreements
- **Return Type**: `AgreementViewModel[]`
- **Description**: Transforms agreements into view models with display names

### CountryService

Service for managing country data with efficient caching.

#### Properties

| Property          | Type                        | Description                                          |
| ----------------- | --------------------------- | ---------------------------------------------------- |
| `selectedCountry` | `Computed<Country \| null>` | Computed property for the currently selected country |

#### Methods

##### `getCountries(status?: CountryStatus)`

Retrieves countries with optional status filter.

- **Parameters**:
  - `status`: Optional status filter
- **Return Type**: `Observable<Country[]>`
- **Description**: Fetches countries with caching for better performance

##### `getCountryById(id: string)`

Retrieves a specific country by ID.

- **Parameters**:
  - `id`: The country ID
- **Return Type**: `Observable<Country | null>`
- **Description**: Fetches a single country by its ID, checking cache first

##### `getCountriesWithHeadquartersCount()`

Retrieves countries with their headquarters count.

- **Return Type**: `Observable<CountryWithHeadquartersCount[]>`
- **Description**: Fetches countries with the count of associated headquarters

##### `createCountry(country: CountryInsert)`

Creates a new country.

- **Parameters**:
  - `country`: The country data to insert
- **Return Type**: `Observable<Country | null>`
- **Description**: Creates a new country and updates the local state

##### `updateCountry(id: string, updates: CountryUpdate)`

Updates an existing country.

- **Parameters**:
  - `id`: The country ID
  - `updates`: The fields to update
- **Return Type**: `Observable<Country | null>`
- **Description**: Updates a country and refreshes the local state

##### `deleteCountry(id: string)`

Deletes a country.

- **Parameters**:
  - `id`: The country ID
- **Return Type**: `Observable<boolean>`
- **Description**: Deletes a country and updates the local state

##### `setSelectedCountry(id: string | null)`

Sets the selected country ID.

- **Parameters**:
  - `id`: The country ID or null
- **Return Type**: `void`
- **Description**: Updates the selected country signal

##### `toViewModel(countries: Country[])`

Converts countries to view models.

- **Parameters**:
  - `countries`: Array of countries
- **Return Type**: `CountryViewModel[]`
- **Description**: Transforms countries into view models with flag URLs

##### `invalidateCache()`

Invalidates the countries cache.

- **Return Type**: `void`
- **Description**: Forces a refresh of cached data on next request

### AuthService

Service for managing authentication, sessions, and role-based access control.

#### Properties

| Property                 | Type                                  | Description                                                           |
| ------------------------ | ------------------------------------- | --------------------------------------------------------------------- |
| `acting`                 | `ReadonlySignal<boolean>`             | Signal indicating if an authentication action is in progress          |
| `loading`                | `ReadonlySignal<boolean>`             | Signal indicating if a loading operation is in progress               |
| `session`                | `ReadonlySignal<AuthSession \| null>` | Signal containing the current authentication session                  |
| `userId$`                | `Observable<string>`                  | Observable of the current user ID                                     |
| `userRoles`              | `Computed<string[]>`                  | Computed property for the current user's roles                        |
| `isAuthenticated`        | `Computed<boolean>`                   | Computed property indicating if the user is authenticated             |
| `isAuthenticatedAsAdmin` | `Computed<boolean>`                   | Computed property indicating if the user is authenticated as an admin |

#### Methods

##### `getUserId()`

Returns the current user ID.

- **Return Type**: `Promise<string>`
- **Description**: Asynchronously retrieves the current user's ID

##### `refreshToken()`

Refreshes the authentication token.

- **Return Type**: `Observable<string>`
- **Description**: Refreshes the session token and returns the new access token
- **Throws**: Error if token refresh fails

##### `signIn(email: string, password: string)`

Signs in a user with email and password.

- **Parameters**:
  - `email`: User's email
  - `password`: User's password
- **Return Type**: `Promise<{ data: AuthResponse; error: AuthError }>`
- **Description**: Authenticates a user and updates the session

##### `signOut()`

Signs out the current user.

- **Return Type**: `Promise<{ error: AuthError }>`
- **Description**: Ends the current session and redirects to home

##### `hasRole(role: string)`

Checks if the current user has a specific role.

- **Parameters**:
  - `role`: The role to check
- **Return Type**: `boolean`
- **Description**: Returns true if the user has the specified role

##### `hasAnyRole(roles: string[])`

Checks if the current user has any of the specified roles.

- **Parameters**:
  - `roles`: Array of roles to check
- **Return Type**: `boolean`
- **Description**: Returns true if the user has any of the specified roles

##### `getCurrentUserRoles()`

Returns the current user's roles.

- **Return Type**: `string[]`
- **Description**: Gets the array of roles for the current user

## Usage Examples

### SupabaseService Examples

#### Basic Usage

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { SupabaseService } from '@zambia/data-access-supabase';

@Component({
  selector: 'app-example',
  template: `
    <div *ngIf="supabaseService.loading()">Loading...</div>
    <div *ngIf="supabaseService.error()">Error: {{ supabaseService.error()?.message }}</div>
  `,
})
export class ExampleComponent implements OnInit {
  supabaseService = inject(SupabaseService);

  ngOnInit() {
    // Get the Supabase client for direct API calls
    const supabase = this.supabaseService.getClient();

    // Example: Fetch data directly using the client
    supabase
      .from('some_table')
      .select('*')
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching data:', error);
        } else {
          console.log('Data:', data);
        }
      });
  }

  resetErrors() {
    this.supabaseService.resetError();
  }
}
```

#### Error Handling

```typescript
import { Component, inject } from '@angular/core';
import { SupabaseService } from '@zambia/data-access-supabase';

@Component({
  selector: 'app-error-handling',
  template: `
    <div *ngIf="supabaseService.error()">
      <h3>Error Occurred</h3>
      <p>{{ supabaseService.error()?.message }}</p>
      <button (click)="supabaseService.resetError()">Dismiss</button>
    </div>
  `,
})
export class ErrorHandlingComponent {
  supabaseService = inject(SupabaseService);
}
```

### AgreementService Examples

#### Fetching Agreements

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { AgreementService } from '@zambia/data-access-supabase';
import { AgreementStatus } from '@zambia/types-supabase';

@Component({
  selector: 'app-agreements-list',
  template: `
    <div *ngIf="loading">Loading agreements...</div>
    <div *ngIf="error">{{ error }}</div>

    <ul *ngIf="agreements.length">
      <li *ngFor="let agreement of agreements">
        {{ agreement.name }} {{ agreement.last_name }} - {{ agreement.email }}
      </li>
    </ul>

    <button (click)="loadActiveAgreements()">Load Active Agreements</button>
  `,
})
export class AgreementsListComponent implements OnInit {
  private agreementService = inject(AgreementService);

  agreements: any[] = [];
  loading = false;
  error: string | null = null;

  ngOnInit() {
    this.loadAgreements();
  }

  loadAgreements() {
    this.loading = true;
    this.error = null;

    this.agreementService.getAgreements().subscribe({
      next: (data) => {
        this.agreements = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }

  loadActiveAgreements() {
    this.loading = true;
    this.error = null;

    this.agreementService.getAgreements(AgreementStatus.ACTIVE).subscribe({
      next: (data) => {
        this.agreements = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }
}
```

#### Creating an Agreement

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgreementService } from '@zambia/data-access-supabase';
import { AgreementInsert, AgreementStatus } from '@zambia/types-supabase';

@Component({
  selector: 'app-agreement-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div>
        <label for="name">First Name</label>
        <input id="name" formControlName="name" />
      </div>

      <div>
        <label for="last_name">Last Name</label>
        <input id="last_name" formControlName="last_name" />
      </div>

      <div>
        <label for="email">Email</label>
        <input id="email" formControlName="email" type="email" />
      </div>

      <button type="submit" [disabled]="form.invalid || submitting">
        {{ submitting ? 'Creating...' : 'Create Agreement' }}
      </button>
    </form>
  `,
})
export class AgreementFormComponent {
  private fb = inject(FormBuilder);
  private agreementService = inject(AgreementService);

  submitting = false;

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit() {
    if (this.form.invalid) return;

    this.submitting = true;

    const newAgreement: AgreementInsert = {
      ...this.form.value,
      status: AgreementStatus.PENDING,
      created_at: new Date().toISOString(),
    };

    this.agreementService.createAgreement(newAgreement).subscribe({
      next: (agreement) => {
        this.submitting = false;
        if (agreement) {
          console.log('Agreement created:', agreement);
          this.form.reset();
          // Navigate or show success message
        }
      },
      error: (err) => {
        this.submitting = false;
        console.error('Error creating agreement:', err);
        // Show error message
      },
    });
  }
}
```

#### Managing Agreement Roles

```typescript
import { Component, inject, Input, OnInit } from '@angular/core';
import { AgreementService } from '@zambia/data-access-supabase';

@Component({
  selector: 'app-agreement-roles',
  template: `
    <div *ngIf="loading">Loading roles...</div>

    <div *ngIf="agreement">
      <h3>Roles for {{ agreement.name }} {{ agreement.last_name }}</h3>

      <ul *ngIf="roles.length">
        <li *ngFor="let role of roles">
          {{ role.name }}
          <button (click)="removeRole(role.id)">Remove</button>
        </li>
      </ul>

      <div>
        <select [(ngModel)]="selectedRoleId">
          <option value="">Select a role to add</option>
          <option *ngFor="let role of availableRoles" [value]="role.id">
            {{ role.name }}
          </option>
        </select>

        <button [disabled]="!selectedRoleId" (click)="addRole()">Add Role</button>
      </div>
    </div>
  `,
})
export class AgreementRolesComponent implements OnInit {
  private agreementService = inject(AgreementService);

  @Input() agreementId!: string;

  agreement: any = null;
  roles: any[] = [];
  availableRoles: any[] = [];
  selectedRoleId = '';
  loading = false;

  ngOnInit() {
    this.loadAgreement();
    this.loadRoles();
  }

  loadAgreement() {
    this.loading = true;
    this.agreementService.getAgreementById(this.agreementId).subscribe({
      next: (agreement) => {
        this.agreement = agreement;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading agreement:', err);
        this.loading = false;
      },
    });
  }

  loadRoles() {
    // This would typically come from a RoleService
    this.availableRoles = [
      { id: '1', name: 'Admin' },
      { id: '2', name: 'User' },
      { id: '3', name: 'Guest' },
    ];

    // Load the agreement's current roles
    this.agreementService.getAgreementsWithRoles().subscribe({
      next: (agreementsWithRoles) => {
        const currentAgreement = agreementsWithRoles.find((a) => a.id === this.agreementId);
        if (currentAgreement) {
          this.roles = currentAgreement.roles || [];
        }
      },
    });
  }

  addRole() {
    if (!this.selectedRoleId) return;

    this.loading = true;
    this.agreementService.addRoleToAgreement(this.agreementId, this.selectedRoleId).subscribe({
      next: (success) => {
        this.loading = false;
        if (success) {
          // Add the role to the local array for immediate UI update
          const role = this.availableRoles.find((r) => r.id === this.selectedRoleId);
          if (role && !this.roles.some((r) => r.id === role.id)) {
            this.roles.push(role);
          }
          this.selectedRoleId = '';
        }
      },
      error: (err) => {
        console.error('Error adding role:', err);
        this.loading = false;
      },
    });
  }

  removeRole(roleId: string) {
    this.loading = true;
    this.agreementService.removeRoleFromAgreement(this.agreementId, roleId).subscribe({
      next: (success) => {
        this.loading = false;
        if (success) {
          // Remove the role from the local array for immediate UI update
          this.roles = this.roles.filter((r) => r.id !== roleId);
        }
      },
      error: (err) => {
        console.error('Error removing role:', err);
        this.loading = false;
      },
    });
  }
}
```

### CountryService Examples

#### Displaying Countries with Caching

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CountryService } from '@zambia/data-access-supabase';
import { CountryViewModel } from '@zambia/types-supabase';

@Component({
  selector: 'app-countries-list',
  template: `
    <div *ngIf="loading">Loading countries...</div>

    <div *ngIf="countries.length" class="countries-grid">
      <div *ngFor="let country of countries" class="country-card">
        <img [src]="country.flagUrl" [alt]="country.name + ' flag'" />
        <h3>{{ country.name }}</h3>
        <p>Code: {{ country.code }}</p>
      </div>
    </div>

    <button (click)="refreshCountries()">Refresh</button>
  `,
})
export class CountriesListComponent implements OnInit {
  private countryService = inject(CountryService);

  countries: CountryViewModel[] = [];
  loading = false;

  ngOnInit() {
    this.loadCountries();
  }

  loadCountries() {
    this.loading = true;

    this.countryService.getCountries().subscribe({
      next: (data) => {
        // Convert to view models with flag URLs
        this.countries = this.countryService.toViewModel(data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading countries:', err);
        this.loading = false;
      },
    });
  }

  refreshCountries() {
    // Force a refresh by invalidating the cache
    this.countryService.invalidateCache();
    this.loadCountries();
  }
}
```

#### Country Details with Headquarters Count

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CountryService } from '@zambia/data-access-supabase';
import { CountryWithHeadquartersCount } from '@zambia/types-supabase';

@Component({
  selector: 'app-country-headquarters',
  template: `
    <div *ngIf="loading">Loading data...</div>

    <table *ngIf="countriesWithHQ.length">
      <thead>
        <tr>
          <th>Country</th>
          <th>Code</th>
          <th>Headquarters</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let country of countriesWithHQ">
          <td>{{ country.name }}</td>
          <td>{{ country.code }}</td>
          <td>{{ country.headquartersCount }}</td>
        </tr>
      </tbody>
    </table>
  `,
})
export class CountryHeadquartersComponent implements OnInit {
  private countryService = inject(CountryService);

  countriesWithHQ: CountryWithHeadquartersCount[] = [];
  loading = false;

  ngOnInit() {
    this.loading = true;

    this.countryService.getCountriesWithHeadquartersCount().subscribe({
      next: (data) => {
        this.countriesWithHQ = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading countries with HQ count:', err);
        this.loading = false;
      },
    });
  }
}
```

#### Creating and Updating Countries

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryService } from '@zambia/data-access-supabase';
import { CountryInsert, CountryStatus } from '@zambia/types-supabase';

@Component({
  selector: 'app-country-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div>
        <label for="name">Country Name</label>
        <input id="name" formControlName="name" />
      </div>

      <div>
        <label for="code">Country Code</label>
        <input id="code" formControlName="code" maxlength="2" />
        <small>2-letter ISO code (e.g., US, UK, DE)</small>
      </div>

      <button type="submit" [disabled]="form.invalid || submitting">
        {{ submitting ? 'Saving...' : 'Save Country' }}
      </button>
    </form>
  `,
})
export class CountryFormComponent {
  private fb = inject(FormBuilder);
  private countryService = inject(CountryService);

  submitting = false;

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    code: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
  });

  onSubmit() {
    if (this.form.invalid) return;

    this.submitting = true;

    const newCountry: CountryInsert = {
      ...this.form.value,
      status: CountryStatus.ACTIVE,
    };

    this.countryService.createCountry(newCountry).subscribe({
      next: (country) => {
        this.submitting = false;
        if (country) {
          console.log('Country created:', country);
          this.form.reset();
          // Navigate or show success message
        }
      },
      error: (err) => {
        this.submitting = false;
        console.error('Error creating country:', err);
        // Show error message
      },
    });
  }
}
```

### AuthService Examples

#### Basic Authentication

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@zambia/data-access-auth';

@Component({
  selector: 'app-login',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div>
        <label for="email">Email</label>
        <input id="email" formControlName="email" type="email" />
      </div>

      <div>
        <label for="password">Password</label>
        <input id="password" formControlName="password" type="password" />
      </div>

      <div *ngIf="error" class="error">
        {{ error }}
      </div>

      <button type="submit" [disabled]="form.invalid || authService.acting()">
        {{ authService.acting() ? 'Signing in...' : 'Sign In' }}
      </button>
    </form>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public authService = inject(AuthService);

  error: string | null = null;

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  async onSubmit() {
    if (this.form.invalid) return;

    this.error = null;
    const { email, password } = this.form.value;

    try {
      const { data, error } = await this.authService.signIn(email, password);

      if (error) {
        this.error = error.message;
        return;
      }

      if (data.session) {
        // Redirect to dashboard or home page
        this.router.navigate(['/dashboard']);
      }
    } catch (err) {
      this.error = 'An unexpected error occurred. Please try again.';
      console.error('Sign in error:', err);
    }
  }
}
```

#### User Profile with Role-Based Access

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '@zambia/data-access-auth';

@Component({
  selector: 'app-user-profile',
  template: `
    <div *ngIf="!authService.isAuthenticated()">Please sign in to view your profile.</div>

    <div *ngIf="authService.isAuthenticated()">
      <h2>User Profile</h2>

      <div *ngIf="authService.session() as session">
        <p><strong>Email:</strong> {{ session.user?.email }}</p>
        <p><strong>User ID:</strong> {{ session.user?.id }}</p>
        <p><strong>Last Sign In:</strong> {{ session.user?.last_sign_in_at | date: 'medium' }}</p>
      </div>

      <div>
        <h3>Your Roles</h3>
        <ul>
          <li *ngFor="let role of authService.userRoles()">{{ role }}</li>
        </ul>
      </div>

      <div *ngIf="authService.isAuthenticatedAsAdmin()">
        <h3>Admin Panel</h3>
        <p>This section is only visible to administrators.</p>
        <!-- Admin-only content -->
      </div>

      <button (click)="signOut()">Sign Out</button>
    </div>
  `,
})
export class UserProfileComponent implements OnInit {
  authService = inject(AuthService);
  userId: string | null = null;

  ngOnInit() {
    // Example of getting the user ID asynchronously
    this.authService.getUserId().then((id) => {
      this.userId = id;
    });
  }

  async signOut() {
    await this.authService.signOut();
    // The router navigation is handled inside the signOut method
  }
}
```

#### Token Refresh Example

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '@zambia/data-access-auth';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-protected-data',
  template: `
    <div *ngIf="loading">Loading protected data...</div>
    <div *ngIf="error">{{ error }}</div>

    <div *ngIf="data">
      <h3>Protected Data</h3>
      <pre>{{ data | json }}</pre>
    </div>

    <button (click)="loadProtectedData()">Refresh Data</button>
  `,
})
export class ProtectedDataComponent implements OnInit {
  private authService = inject(AuthService);
  private http = inject(HttpClient);

  data: any = null;
  loading = false;
  error: string | null = null;

  ngOnInit() {
    this.loadProtectedData();
  }

  loadProtectedData() {
    if (!this.authService.isAuthenticated()) {
      this.error = 'You must be authenticated to access this data.';
      return;
    }

    this.loading = true;
    this.error = null;

    // First check if we need to refresh the token
    this.authService
      .refreshToken()
      .pipe(
        // After refreshing (or if not needed), make the API call
        switchMap((token) => {
          return this.http.get('/api/protected-data', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }),
        catchError((err) => {
          this.error = 'Failed to load data. Please try again.';
          console.error('Error loading protected data:', err);
          return of(null);
        })
      )
      .subscribe((result) => {
        this.loading = false;
        if (result) {
          this.data = result;
        }
      });
  }
}
```

#### Role-Based Route Guard Integration

```typescript
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@zambia/data-access-auth';

// Role-based route guard
export const hasRoleGuard = (roles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      // Redirect to login if not authenticated
      router.navigate(['/login']);
      return false;
    }

    if (!authService.hasAnyRole(roles)) {
      // Redirect to access denied if authenticated but doesn't have required roles
      router.navigate(['/access-denied']);
      return false;
    }

    return true;
  };
};

// Usage in routes configuration:
/*
const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [hasRoleGuard(['admin'])]
  },
  {
    path: 'manager',
    component: ManagerComponent,
    canActivate: [hasRoleGuard(['admin', 'manager'])]
  }
];
*/
```

## Edge Cases & Limitations

### SupabaseService

- **Connection Handling**: The service doesn't automatically reconnect if the connection to Supabase is lost. Applications should implement their own reconnection logic for long-lived connections.
- **Large Data Sets**: When fetching large data sets, consider implementing pagination to avoid performance issues.
- **Error Handling**: The service provides basic error handling, but applications should implement more specific error handling for different types of errors.
- **Browser Compatibility**: The service works in all modern browsers, but older browsers may require polyfills for certain features.

### AgreementService

- **Caching Limitations**: The cache for agreements with roles is time-based (5 minutes) and doesn't automatically invalidate when data changes on the server. Use `invalidateCache()` when you need fresh data.
- **Concurrent Modifications**: The service doesn't handle concurrent modifications. If multiple users update the same agreement simultaneously, the last update will overwrite previous changes.
- **Role Management**: Adding or removing roles doesn't validate if the role exists or if the user has permission to modify roles.
- **Performance Considerations**: The `getAgreementsWithRoles()` method fetches all agreements with their roles, which can be inefficient for large datasets. Consider implementing pagination or more specific queries for large datasets.

### CountryService

- **Flag URLs**: The `toViewModel` method assumes that the country code is valid and that the flag is available at the specified URL. Applications should handle cases where flags might not be available.
- **Cache Invalidation**: The cache doesn't automatically invalidate when data changes on the server. Use `invalidateCache()` when you need fresh data.
- **Headquarters Count**: The `getCountriesWithHeadquartersCount()` method doesn't filter headquarters by status, so it includes all headquarters regardless of their status.
- **Browser Storage**: The service doesn't persist the cache between browser sessions. If persistence is needed, consider implementing a storage solution.

### AuthService

- **Token Expiration**: The service doesn't automatically refresh tokens before they expire. Applications should implement token refresh logic for long-lived sessions.
- **Role Management**: The service assumes that roles are stored in the user's metadata. If your Supabase setup uses a different approach, you'll need to modify the service.
- **Multiple Sessions**: The service doesn't support multiple concurrent sessions for different users.
- **Offline Support**: There's no offline support. If the user loses connection, authentication operations will fail.

## Advanced Scenarios

### Custom Supabase Client Configuration

```typescript
import { APP_INITIALIZER, Provider } from '@angular/core';
import { SupabaseService } from '@zambia/data-access-supabase';

// Custom initializer that configures the Supabase client with additional options
export function configureSupabase(supabaseService: SupabaseService) {
  return () => {
    const client = supabaseService.getClient();

    // Configure client with custom settings
    client.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      // Perform custom actions on auth state change
    });

    // Set up custom headers or other configuration
    // client.headers = { ... }

    return Promise.resolve();
  };
}

// Provider to be added to your app's providers array
export const SUPABASE_INITIALIZER_PROVIDER: Provider = {
  provide: APP_INITIALIZER,
  useFactory: configureSupabase,
  deps: [SupabaseService],
  multi: true,
};
```

### Implementing Real-time Updates

```typescript
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SupabaseService } from '@zambia/data-access-supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

@Component({
  selector: 'app-realtime-updates',
  template: `
    <h2>Real-time Updates</h2>
    <div *ngFor="let update of updates">{{ update.timestamp | date: 'medium' }}: {{ update.message }}</div>
  `,
})
export class RealtimeUpdatesComponent implements OnInit, OnDestroy {
  private supabaseService = inject(SupabaseService);
  private channel: RealtimeChannel | null = null;

  updates: Array<{ timestamp: Date; message: string }> = [];

  ngOnInit() {
    this.setupRealtimeSubscription();
  }

  ngOnDestroy() {
    this.teardownRealtimeSubscription();
  }

  private setupRealtimeSubscription() {
    const supabase = this.supabaseService.getClient();

    this.channel = supabase
      .channel('table-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes
          schema: 'public',
          table: 'agreements',
        },
        (payload) => {
          console.log('Change received:', payload);
          this.updates.unshift({
            timestamp: new Date(),
            message: `${payload.eventType} operation on record ${payload.new.id}`,
          });
        }
      )
      .subscribe();
  }

  private teardownRealtimeSubscription() {
    if (this.channel) {
      this.supabaseService.getClient().removeChannel(this.channel);
    }
  }
}
```

### Custom Error Handling Strategy

```typescript
import { ErrorHandler, Injectable, Provider } from '@angular/core';
import { SupabaseService } from '@zambia/data-access-supabase';

@Injectable()
export class SupabaseErrorHandler implements ErrorHandler {
  constructor(private supabaseService: SupabaseService) {}

  handleError(error: any): void {
    // Check if this is a Supabase error
    if (error && error.code && error.code.startsWith('PGRST')) {
      console.error('Supabase PostgreSQL error:', error);

      // Handle specific Supabase error codes
      switch (error.code) {
        case 'PGRST301':
          // Handle foreign key violation
          this.supabaseService.error.set(new Error('Referenced record does not exist'));
          break;
        case 'PGRST401':
          // Handle unauthorized access
          this.supabaseService.error.set(new Error('You do not have permission to perform this action'));
          break;
        default:
          this.supabaseService.error.set(error);
      }
    } else if (error && error.code && error.code.startsWith('AUTH')) {
      console.error('Supabase Auth error:', error);

      // Handle specific auth error codes
      switch (error.code) {
        case 'AUTH001':
          this.supabaseService.error.set(new Error('Invalid credentials'));
          break;
        case 'AUTH002':
          this.supabaseService.error.set(new Error('Email not confirmed'));
          break;
        default:
          this.supabaseService.error.set(error);
      }
    } else {
      // For non-Supabase errors, use default handling
      console.error('Application error:', error);
    }
  }
}

// Provider to be added to your app's providers array
export const SUPABASE_ERROR_HANDLER_PROVIDER: Provider = {
  provide: ErrorHandler,
  useClass: SupabaseErrorHandler,
};
```

### Integration with NgRx Store

```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { CountryService } from '@zambia/data-access-supabase';

// Action creators (simplified example)
const loadCountries = createAction('[Country] Load Countries');
const loadCountriesSuccess = createAction('[Country] Load Countries Success', props<{ countries: any[] }>());
const loadCountriesFailure = createAction('[Country] Load Countries Failure', props<{ error: any }>());

@Injectable()
export class CountryEffects {
  loadCountries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCountries),
      switchMap(() =>
        this.countryService.getCountries().pipe(
          map((countries) => loadCountriesSuccess({ countries })),
          catchError((error) => of(loadCountriesFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private countryService: CountryService
  ) {}
}
```

## Troubleshooting

### Common Errors and Solutions

#### Authentication Issues

| Error                       | Possible Cause                       | Solution                                                                    |
| --------------------------- | ------------------------------------ | --------------------------------------------------------------------------- |
| "Invalid login credentials" | Incorrect email or password          | Verify credentials and ensure the user exists in Supabase                   |
| "Email not confirmed"       | User hasn't confirmed their email    | Implement email confirmation flow or confirm manually in Supabase dashboard |
| "JWT expired"               | Authentication token has expired     | Use `refreshToken()` method to get a new token                              |
| "User not found"            | Trying to access a non-existent user | Verify the user exists in Supabase                                          |

#### Data Access Issues

| Error                                            | Possible Cause                                          | Solution                                                           |
| ------------------------------------------------ | ------------------------------------------------------- | ------------------------------------------------------------------ |
| "Foreign key violation"                          | Trying to create a record with invalid foreign key      | Ensure the referenced record exists before creating the new record |
| "Duplicate key value violates unique constraint" | Trying to create a record with a duplicate unique value | Check if the record already exists before creating                 |
| "Permission denied"                              | User doesn't have permission to access the resource     | Verify RLS (Row Level Security) policies in Supabase               |
| "Relation does not exist"                        | Table doesn't exist or is misspelled                    | Check table name and ensure it exists in the database              |

#### Service-Specific Issues

| Service          | Issue                                  | Solution                                             |
| ---------------- | -------------------------------------- | ---------------------------------------------------- |
| SupabaseService  | "Failed to initialize Supabase client" | Check API URL and key in environment configuration   |
| AgreementService | Cache not updating after changes       | Call `invalidateCache()` after making changes        |
| CountryService   | Flag images not loading                | Verify country codes are correct and in lowercase    |
| AuthService      | Roles not being detected               | Ensure roles are stored in user metadata as expected |

### Debugging Tips

1. **Enable Supabase Debug Mode**:

   ```typescript
   // In your app initialization
   const supabase = createClient(url, key, {
     debug: true, // Enable debug mode in development
   });
   ```

2. **Monitor Network Requests**:
   Use browser developer tools to monitor network requests to Supabase API endpoints.

3. **Check Console Errors**:
   The services log errors to the console. Check for messages starting with "Supabase error".

4. **Verify Environment Variables**:
   Ensure your Supabase URL and API key are correctly set in your environment configuration.

5. **Test with Supabase CLI**:
   Use the Supabase CLI to test queries directly against your database.

### FAQ

#### Q: How do I handle offline support?

A: These services don't provide built-in offline support. Consider implementing a service worker and local storage solution for offline capabilities.

#### Q: Can I use these services with SSR (Server-Side Rendering)?

A: Yes, but you'll need to ensure that Supabase client initialization happens only in the browser context or implement isomorphic handling.

#### Q: How do I implement pagination with these services?

A: Extend the service methods to accept pagination parameters (limit, offset) and pass them to the Supabase queries.

#### Q: How can I improve performance for large datasets?

A: Use more specific queries, implement pagination, and consider using Supabase's RPC (Remote Procedure Call) functions for complex operations.

#### Q: How do I handle file uploads?

A: Use Supabase Storage through the client:

```typescript
const { data, error } = await this.supabaseService.getClient().storage.from('bucket-name').upload('file-path', file);
```
