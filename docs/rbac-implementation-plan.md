# RBAC Implementation Plan & Role-Based Dashboard Design

## Table of Contents

1. [Overview](#overview)
2. [Frontend RBAC Strategy](#frontend-rbac-strategy)
   - [Structural Directives](#structural-directives)
   - [Route Protection](#route-protection)
   - [Component-Level Control](#component-level-control)
   - [State Management Integration](#state-management-integration)
   - [UI Feedback Mechanisms](#ui-feedback-mechanisms)
3. [Backend RBAC Strategy](#backend-rbac-strategy)
   - [Row-Level Security (RLS) Policies](#row-level-security-rls-policies)
   - [Database Functions (RPC)](#database-functions-rpc)
   - [Data Integrity & Security](#data-integrity--security)
4. [Frontend-Backend Integration](#frontend-backend-integration)
   - [Authentication Flow](#authentication-flow)
   - [Data Access Flow](#data-access-flow)
   - [Error Handling](#error-handling)
5. [Role-Based Dashboard Design](#role-based-dashboard-design)
   - [Component Structure](#component-structure)
   - [Data Fetching Strategy](#data-fetching-strategy)
   - [Role-Specific Views](#role-specific-views)
6. [Scalability and Maintainability](#scalability-and-maintainability)
   - [Centralized Role Definitions](#centralized-role-definitions)
   - [Role Hierarchy Management](#role-hierarchy-management)
   - [Testing Strategy](#testing-strategy)
   - [Documentation](#documentation)
7. [Implementation Roadmap](#implementation-roadmap)

## Overview

This document outlines a comprehensive implementation plan for a Role-Based Access Control (RBAC) system within the Akademia application. The plan covers both frontend and backend strategies, ensuring that users are restricted from accessing or modifying data outside their permissions and only interact with relevant UI elements.

The RBAC system is designed around a hierarchical role structure, from SUPERADMIN (highest level) to STUDENT (lowest level), with each role having specific permissions and access levels. The implementation leverages Angular's latest features (Signals, standalone components) on the frontend and Supabase's Row-Level Security (RLS) on the backend.

## Frontend RBAC Strategy

### Structural Directives

Three custom directives have been implemented to conditionally render UI elements based on user roles:

1. **HasRoleDirective** (`*hasRole`): Renders an element only if the user has a specific role.

```typescript
// Usage
<div *hasRole="'superadmin'">Only visible to superadmins</div>
```

2. **HasAnyRoleDirective** (`*hasAnyRole`): Renders an element if the user has any of the specified roles.

```typescript
// Usage
<div *hasAnyRole="['superadmin', 'general_director']">
  Visible to superadmins or general directors
</div>
```

3. **HasRoleLevelDirective** (`*hasRoleLevel`): Renders an element if the user has a role with a level equal to or higher than the specified role.

```typescript
// Usage
<div *hasRoleLevel="'headquarter_manager'">
  Visible to headquarter managers and higher roles
</div>
```

These directives leverage the `AuthService` and `RolesService` to check the user's roles and permissions, providing a declarative way to control UI visibility based on roles.

### Route Protection

Two route guards have been implemented to protect routes based on user roles:

1. **rolesGuard**: Checks if the user has any of the required roles specified in the route data.

```typescript
// Usage in route configuration
{
  path: 'headquarter/:id',
  component: HeadquarterComponent,
  canActivate: [authGuard, rolesGuard],
  data: { requiredRoles: [Role.SUPERADMIN, Role.HEADQUARTER_MANAGER] }
}
```

2. **roleLevelGuard**: Checks if the user has a role with a level equal to or higher than the specified role.

```typescript
// Usage in route configuration
{
  path: 'admin-dashboard',
  component: AdminDashboardComponent,
  canActivate: [authGuard, roleLevelGuard],
  data: { requiredRoleLevel: Role.HEADQUARTER_MANAGER }
}
```

These guards redirect unauthorized users to an access denied page, providing a secure way to protect routes based on user roles.

### Component-Level Control

Components can inject the `RolesService` to implement role-based logic within their templates and methods:

```typescript
// In component class
private rolesService = inject(RolesService);

// In template
@if (rolesService.hasRole(Role.SUPERADMIN)) {
  <button (click)="deleteItem()">Delete</button>
}

// In methods
deleteItem() {
  if (this.rolesService.hasRole(Role.SUPERADMIN)) {
    // Perform delete operation
  }
}
```

This approach allows for more complex role-based logic that can't be easily expressed with directives.

### State Management Integration

The RBAC system integrates with Angular's state management using Signals:

1. **AuthService**: Provides signals for the current user's session and roles.

```typescript
// In AuthService
readonly session = signal<Session | null>(null);
readonly userRoles = computed(() => {
  const user = this.session()?.user;
  if (!user || !user.user_metadata?.['roles']) {
    return [];
  }
  return user.user_metadata['roles']
    .map((role) => role?.code)
    .filter((code): code is string => typeof code === 'string' && code.length > 0);
});
```

2. **RolesService**: Provides methods for checking roles and role levels, leveraging computed signals.

```typescript
// In RolesService
private readonly userRoleLevel = computed(() => {
  const userRoles = this.authService.userRoles();
  if (!userRoles.length) return 0;
  return Math.max(
    ...userRoles.map((role) => this.roleLevels.get(role as RoleCode) || 0)
  );
});

public hasRoleLevelOrHigher(role: RoleCode): boolean {
  const requiredLevel = this.roleLevels.get(role) || 0;
  return this.userRoleLevel() >= requiredLevel;
}
```

This integration ensures that UI elements reactively update when the user's roles change.

### UI Feedback Mechanisms

When a user attempts to access a resource they don't have permission to view, they are redirected to an access denied page that provides clear feedback:

```typescript
// In route guards
await router.navigate(['/access-denied']);
```

The `AccessDeniedPageUiComponent` displays a message explaining that access is denied and provides a button to navigate back to the dashboard. It also includes a countdown timer that automatically redirects to the dashboard after a set time.

## Backend RBAC Strategy

### Row-Level Security (RLS) Policies

Supabase's Row-Level Security (RLS) is used to enforce access control at the database level. RLS policies are defined for each table and operation type (SELECT, INSERT, UPDATE, DELETE), ensuring that users can only access and modify data according to their assigned roles.

Example RLS policy for the headquarters table:

```sql
-- Policy for headquarter managers to view their own headquarter
CREATE POLICY headquarters_view_own ON headquarters
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM collaborators
            WHERE collaborators.user_id = auth.uid()
            AND collaborators.headquarter_id = headquarters.id
            AND EXISTS (
                SELECT 1 FROM auth.users
                WHERE auth.users.id = auth.uid()
                AND auth.users.raw_user_meta_data->>'roles' ? 'headquarter_manager'
            )
        )
    );
```

See the [Supabase RLS Policies](./supabase-rls-policies.md) document for detailed RLS policies for all tables.

### Database Functions (RPC)

For complex operations that can't be easily handled with RLS policies alone, PostgreSQL functions (callable via Supabase RPC) are used. These functions include role-based access checks and return only the data the user is authorized to see.

Example RPC function for fetching dashboard statistics:

```sql
-- Function to get headquarter dashboard stats (for headquarter managers)
CREATE OR REPLACE FUNCTION get_headquarter_dashboard_stats(headquarter_id UUID DEFAULT NULL)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result JSON;
    user_headquarter_id UUID;
BEGIN
    -- If no headquarter_id is provided, get the user's headquarter
    IF headquarter_id IS NULL THEN
        SELECT collaborators.headquarter_id INTO user_headquarter_id
        FROM collaborators
        WHERE collaborators.user_id = auth.uid();
        
        IF user_headquarter_id IS NULL THEN
            RAISE EXCEPTION 'No headquarter found for user';
        END IF;
    ELSE
        user_headquarter_id := headquarter_id;
    END IF;

    -- Check if user has appropriate role and access to this headquarter
    IF NOT EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND (
            auth.users.raw_user_meta_data->>'roles' ? 'superadmin' OR
            auth.users.raw_user_meta_data->>'roles' ? 'general_director' OR
            auth.users.raw_user_meta_data->>'roles' ? 'executive_leader' OR
            (
                auth.users.raw_user_meta_data->>'roles' ? 'headquarter_manager' AND
                EXISTS (
                    SELECT 1 FROM collaborators
                    WHERE collaborators.user_id = auth.uid()
                    AND collaborators.headquarter_id = user_headquarter_id
                )
            )
        )
    ) THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;

    -- Get statistics for the headquarter
    SELECT json_build_object(
        'students_count', (SELECT COUNT(*) FROM students WHERE students.headquarter_id = user_headquarter_id),
        'facilitators_count', (SELECT COUNT(*) FROM collaborators WHERE collaborators.headquarter_id = user_headquarter_id AND role_id = 'facilitator'),
        'companions_count', (SELECT COUNT(*) FROM collaborators WHERE collaborators.headquarter_id = user_headquarter_id AND role_id = 'companion'),
        'workshops_count', (SELECT COUNT(*) FROM workshops WHERE workshops.headquarter_id = user_headquarter_id)
    ) INTO result;

    RETURN result;
END;
$$;
```

### Data Integrity & Security

To ensure data integrity and security, the following measures are implemented:

1. **Default Deny**: All tables have RLS enabled with a default deny policy, meaning no access is granted unless explicitly allowed by a policy.
2. **Role-Based Access**: Policies are primarily based on user roles stored in the JWT token.
3. **Scope-Based Restrictions**: Users are restricted to data within their scope (e.g., headquarter managers can only access data for their headquarter).
4. **Operation-Specific Policies**: Different policies for SELECT, INSERT, UPDATE, and DELETE operations.
5. **Hierarchical Access**: Higher-level roles inherit access from lower-level roles.
6. **Sensitive Field Protection**: Policies for self-updates include checks to prevent users from modifying sensitive fields like status or role assignments.

## Frontend-Backend Integration

### Authentication Flow

1. User logs in via the `AuthService.signIn()` method.
2. Supabase authenticates the user and returns a session with a JWT token.
3. The JWT token includes the user's roles in the `user_metadata` claim.
4. The `AuthService` stores the session and exposes the user's roles via the `userRoles` computed signal.
5. The `RolesService` uses the user's roles to determine their permissions.

```typescript
// Authentication flow
async signIn(email: string, password: string) {
  this.#acting.set(true);
  this.#loading.set(true);

  const v = await this.#supabase.auth.signInWithPassword({
    email,
    password,
  });
  this.router.navigate(['/dashboard/panel']);
  this.#acting.set(false);
  this.#loading.set(false);
  return v;
}
```

### Data Access Flow

1. User navigates to a route protected by `rolesGuard` or `roleLevelGuard`.
2. Guard checks if the user has the required roles or role level.
3. If authorized, the component is loaded and makes API requests to Supabase.
4. Supabase applies RLS policies based on the user's JWT token.
5. Only authorized data is returned to the component.

```typescript
// Data access flow in a service
public getDashboardStats(): Observable<DashboardStat[]> {
  const supabase = this.supabaseService.getClient();
  
  // Call RPC function for global stats
  return from(supabase.rpc('get_global_dashboard_stats')).pipe(
    map(response => this.supabaseService.handleResponse(response, 'Fetch Dashboard Stats')),
    map(data => this.mapToStatsList(data))
  );
}
```

### Error Handling

When a user attempts to access data they don't have permission to view, Supabase returns an error. The `SupabaseService` handles these errors and provides feedback to the user:

```typescript
// Error handling in SupabaseService
protected handleError(error: Error | PostgrestError, context = 'Operation'): void {
  console.error(`Supabase ${context} failed:`, error);
  this.error.set(error instanceof Error ? error : new Error(error['message'] || 'Unknown error'));
  this.loading.set(false);
}
```

Components can display these errors to the user:

```html
<!-- Error display in component template -->
@if (supabaseService.error()) {
  <div class="error-message">
    {{ supabaseService.error()?.message }}
  </div>
}
```

## Role-Based Dashboard Design

### Component Structure

The dashboard is structured as a set of components that adapt to the user's role:

1. **DashboardSmartComponent**: The main dashboard component that includes the sidebar and layout.
2. **PanelSmartComponent**: The main dashboard panel that displays role-specific content.
3. **StatsWidgetComponent**: Displays statistics relevant to the user's role.
4. **RecentActivityComponent**: Displays recent activities relevant to the user's role.
5. **RoleSpecificSummaryComponent**: Displays summaries specific to the user's role (e.g., headquarter summary for managers).

```typescript
// PanelSmartComponent structure
@Component({
  selector: 'z-panel',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink,
    HasRoleDirective,
    HasAnyRoleDirective,
    HasRoleLevelDirective
  ],
  template: `
    <div class="p-6">
      <h1 class="mb-6 text-2xl font-bold">Panel de Control</h1>
      
      <!-- Welcome message based on role -->
      <div class="mb-8 rounded-lg bg-white p-6 shadow-md">
        <h2 class="mb-2 text-xl font-semibold">
          Bienvenido, {{ getUserDisplayName() }}
        </h2>
        <p class="text-gray-600">
          @if (rolesService.hasRole(Role.SUPERADMIN)) {
            Tienes acceso completo a todas las funciones del sistema.
          } @else if (rolesService.hasRole(Role.GENERAL_DIRECTOR)) {
            Tienes acceso a la información de todas las sedes.
          } @else if (rolesService.hasRole(Role.HEADQUARTER_MANAGER)) {
            Tienes acceso a la información de tu sede.
          } @else {
            Bienvenido al sistema.
          }
        </p>
      </div>

      <!-- Stats Section -->
      <div class="mb-8">
        <h2 class="mb-4 text-xl font-semibold">Estadísticas</h2>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          @for (stat of stats(); track stat.label) {
            <div class="rounded-lg bg-white p-4 shadow-md">
              <!-- Stat content -->
            </div>
          }
        </div>
      </div>

      <!-- Role-specific sections -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Admin Section -->
        <div *hasRole="Role.SUPERADMIN" class="rounded-lg bg-white p-6 shadow-md">
          <!-- Admin content -->
        </div>

        <!-- Director Section -->
        <div *hasAnyRole="[Role.GENERAL_DIRECTOR, Role.EXECUTIVE_LEADER]" class="rounded-lg bg-white p-6 shadow-md">
          <!-- Director content -->
        </div>

        <!-- Headquarter Manager Section -->
        <div *hasRoleLevel="Role.HEADQUARTER_MANAGER" class="rounded-lg bg-white p-6 shadow-md">
          <!-- Manager content -->
        </div>

        <!-- Recent Activity Section - visible to all -->
        <div class="rounded-lg bg-white p-6 shadow-md">
          <!-- Recent activity content -->
        </div>
      </div>
    </div>
  `,
})
export class PanelSmartComponent {
  // Component implementation
}
```

### Data Fetching Strategy

The dashboard uses a dedicated service (`DashboardDataService`) to fetch role-specific data from Supabase:

```typescript
// DashboardDataService
@Injectable({
  providedIn: 'root',
})
export class DashboardDataService {
  private supabaseService = inject(SupabaseService);
  private authService = inject(AuthService);
  private rolesService = inject(RolesService);

  public getDashboardStats(): Observable<DashboardStat[]> {
    const supabase = this.supabaseService.getClient();
    
    if (this.rolesService.hasRole(Role.SUPERADMIN) || this.rolesService.hasRole(Role.GENERAL_DIRECTOR)) {
      // Call RPC function for global stats
      return from(supabase.rpc('get_global_dashboard_stats')).pipe(
        map(response => this.supabaseService.handleResponse(response, 'Fetch Dashboard Stats')),
        map(data => this.mapToStatsList(data))
      );
    } else if (this.rolesService.hasRole(Role.HEADQUARTER_MANAGER)) {
      // Call RPC function for headquarter-specific stats
      return from(supabase.rpc('get_headquarter_dashboard_stats')).pipe(
        map(response => this.supabaseService.handleResponse(response, 'Fetch Dashboard Stats')),
        map(data => this.mapToStatsList(data))
      );
    } else {
      // Call RPC function for user-specific stats
      return from(supabase.rpc('get_user_dashboard_stats')).pipe(
        map(response => this.supabaseService.handleResponse(response, 'Fetch Dashboard Stats')),
        map(data => this.mapToStatsList(data))
      );
    }
  }

  // Other methods for fetching role-specific data
}
```

This service calls different RPC functions based on the user's role, ensuring that only authorized data is fetched and displayed.

### Role-Specific Views

The dashboard displays different views based on the user's role:

1. **SUPERADMIN**: Full access to all data and functionality, including agreement management and user creation.
2. **GENERAL_DIRECTOR**: Access to aggregated data across all headquarters, with the ability to drill down into specific headquarters.
3. **HEADQUARTER_MANAGER**: Access to data for their specific headquarter, including students, facilitators, and workshops.
4. **FACILITATOR/COMPANION**: Access to data for their assigned students and workshops.
5. **STUDENT**: Access to their own data, enrolled workshops, and assignments.

Each view includes relevant statistics, recent activities, and action buttons appropriate for the user's role.

## Scalability and Maintainability

### Centralized Role Definitions

Roles are defined in a centralized location (`GUARDS_CONSTANTS.ts`) to ensure consistency across the application:

```typescript
export const Role = {
  /* level 100 */
  SUPERADMIN: 'superadmin',
  /* level 90 */
  GENERAL_DIRECTOR: 'general_director',
  EXECUTIVE_LEADER: 'executive_leader',
  /* level 80 */
  PEDAGOGICAL_LEADER: 'pedagogical_leader',
  // ... other roles
} as const;

export type RoleCode = (typeof Role)[keyof typeof Role];
```

This approach makes it easy to add, remove, or modify roles without having to update multiple files.

### Role Hierarchy Management

The role hierarchy is defined in the `RolesService` using a Map that assigns a level to each role:

```typescript
private readonly roleLevels = new Map<RoleCode, number>([
  [Role.SUPERADMIN, 100],
  [Role.GENERAL_DIRECTOR, 90],
  [Role.EXECUTIVE_LEADER, 90],
  // ... other roles
]);
```

This approach makes it easy to adjust the role hierarchy without having to update multiple files.

### Testing Strategy

To ensure the RBAC system works correctly, the following testing approach is recommended:

1. **Unit Tests**: Test individual components of the RBAC system, such as directives, guards, and services.
2. **Integration Tests**: Test the interaction between frontend and backend components, ensuring that RLS policies are correctly applied.
3. **End-to-End Tests**: Test the complete user flow, from login to accessing protected resources.

Example unit test for the `HasRoleDirective`:

```typescript
describe('HasRoleDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['hasRole']);
    
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [HasRoleDirective],
      providers: [
        { provide: AuthService, useValue: authService }
      ]
    });
    
    fixture = TestBed.createComponent(TestComponent);
  });

  it('should show content when user has role', () => {
    authService.hasRole.and.returnValue(true);
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('div');
    expect(element).not.toBeNull();
  });

  it('should hide content when user does not have role', () => {
    authService.hasRole.and.returnValue(false);
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('div');
    expect(element).toBeNull();
  });
});

@Component({
  template: `<div *hasRole="'superadmin'">Content</div>`
})
class TestComponent {}
```

### Documentation

To ensure the RBAC system is well-documented and maintainable, the following documentation is recommended:

1. **Code Comments**: All components of the RBAC system should be well-commented, explaining their purpose and usage.
2. **API Documentation**: The public API of the RBAC system should be documented using JSDoc comments.
3. **Usage Examples**: Provide examples of how to use the RBAC system in different scenarios.
4. **Architecture Diagrams**: Create diagrams that illustrate the architecture of the RBAC system and how its components interact.

## Implementation Roadmap

1. **Phase 1: Frontend RBAC Components**
   - Implement structural directives (`HasRoleDirective`, `HasAnyRoleDirective`, `HasRoleLevelDirective`)
   - Implement route guards (`rolesGuard`, `roleLevelGuard`)
   - Implement `RolesService` with role hierarchy

2. **Phase 2: Backend RLS Policies**
   - Implement RLS policies for all tables
   - Implement RPC functions for complex operations
   - Test policies and functions to ensure they work correctly

3. **Phase 3: Role-Based Dashboard**
   - Implement `DashboardDataService` for fetching role-specific data
   - Implement role-specific dashboard components
   - Test dashboard with different user roles

4. **Phase 4: Testing and Documentation**
   - Write unit tests for all RBAC components
   - Write integration tests for frontend-backend interaction
   - Write end-to-end tests for complete user flows
   - Document the RBAC system architecture and usage
