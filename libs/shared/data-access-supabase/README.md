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

#### Error Handling

```typescript
import { Component, inject } from '@angular/core';
import { SupabaseService } from '@zambia/data-access-supabase';

@Component({
  selector: 'app-error-handling',
  template: `
    @if (supabaseService.error()) {
      <h3>Error Occurred</h3>
      <p>{{ supabaseService.error()?.message }}</p>
      <button (click)="supabaseService.resetError()">Dismiss</button>
    }
  `,
})
export class ErrorHandlingComponent {
  supabaseService = inject(SupabaseService);
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

## Edge Cases & Limitations

### SupabaseService

- **Large Data Sets**: When fetching large data sets, consider implementing pagination to avoid performance issues.
- **Error Handling**: The service provides basic error handling, but applications should implement more specific error handling for different types of errors.

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
