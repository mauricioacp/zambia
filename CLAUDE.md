# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zambia is an Angular application built with NX workspace for managing Akademia's educational organization data across multiple countries. It's designed to manage the organizational structure across different countries, including headquarters, academic seasons, participants, educational activities, and staff members. The system handles role-based access control, agreement management, workshop scheduling, and various administrative functions for the educational organization.

## Technology Stack

- **Core Framework**: Angular (v19)
- **Monorepo Management**: Nx (v20)
- **Backend/Database**: Supabase (PostgreSQL + auth)
- **UI Components**: Taiga UI
- **Styling**: Tailwind CSS
- **Component Development**: Storybook
- **Internationalization**: ngx-translate
- **Testing**: Jest (unit), Playwright (E2E)

## Architecture

### Project Structure and Naming Conventions

The project follows a clear naming convention for libraries:

- **data-access-\*** - Services for data retrieval and manipulation
- **types-\*** - TypeScript type definitions
- **ui-components** - Reusable UI components
- **util-\*** - Utility functions and helpers
- **feat-\*** - Feature modules with smart components

Components follow a type-based naming convention:

- **smart-component** - Container components with business logic
- **ui-component** - Presentational components

### Monorepo Structure

The project follows Nx's monorepo architecture with the following structure:

- **apps/zambia/**: Main Angular application
- **apps/zambia-e2e/**: End-to-end tests
- **libs/shared/**: Shared libraries used across the application
  - **data-access-\***: Data services and API connections
  - **ui-components/**: Reusable UI components
  - **util-\***: Utility functions and helpers
  - **types-\***: TypeScript type definitions
- **libs/zambia/**: Feature-specific libraries
  - **feat-\***: Feature modules (dashboard, auth, shell, countries, etc.)

### Component Organization

- **Smart/Presentational Pattern**: Components are organized into smart (container) and presentational components
- **Facade Pattern**: Services often use facades to simplify access to complex subsystems

### Role-Based Access Control

The application uses a sophisticated role-based access control system with hierarchical roles, each with specific permission levels (numbers in comments indicate hierarchy level):

- **Administration (100)**: Superadmin
- **Top Management (90)**: General Director, Executive Leader
- **Leadership Team (80)**: Various leader roles (Pedagogical, Innovation, Communication, Community, Coordination, Legal Advisor)
- **Coordination Team (70)**: Coordinator, Konsejo Member
- **Headquarters Management (50)**: Headquarter Manager
- **Local Management (40)**: Pedagogical Manager, Communication Manager, Companion Director
- **Assistants (30)**: Manager Assistant
- **Field Staff (20)**: Companion, Facilitator
- **Students (1)**: Student role

Roles are organized into groups that determine access to features and data throughout the application. The role system is implemented with guards and directives for UI elements.

### Code Generation

```bash
# Generate a new feature library
npx nx g @nx/angular:library --name=feat-example --tags=scope:zambia,type:feat --directory=libs/zambia/feat-example

# Generate a smart component
nx g @nx/angular:component --path=libs/zambia/feat-example/src/lib/components/smart/example --export=true --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true --name=example --type=smart-component

# Generate a UI component
nx g @nx/angular:component --path=libs/shared/ui-components/src/lib/ui-components/example --export=true --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true --name=example --type=ui-component
```

### Other Utilities

```bash
# Generate Supabase types
npm run supabase:gen:types:local

# View dependency graph
npm run graph

# Use Commitizen for standardized commits
npm run cm
```

## Environment Configuration

The project uses environment files for configuration:

- `.env.development`: Development environment variables
- `.env.production`: Production environment variables

Example environment variables:

```
API_URL=https://api.yourdomain.com
API_PUBLIC_KEY=your-api-key
PROD=true/false
```

## Database Schema

The application uses Supabase as its backend with the following main entities:

### Core Entities

1. **agreements** - Stores participant agreements with personal info

   - Links to headquarters, roles, and seasons
   - Tracks various agreement statuses and permissions

2. **headquarters** - Regional/local centers of the organization

   - Connected to countries
   - Contains address and contact information

3. **roles** - Defines user roles and permissions

   - Includes code, name, description, and permission levels
   - Contains JSON permissions field for access control

4. **seasons** - Program cycles or academic periods

   - Connected to headquarters
   - Has start and end dates

5. **collaborators** - Staff members with specific roles

   - Connected to headquarters and roles
   - Tracks status (active, inactive, standby)

6. **students** - Program participants

   - Connected to headquarters and seasons
   - Tracks enrollment status and progress

7. **workshops** - Educational sessions
   - Connected to facilitators, headquarters, and seasons
   - Has scheduling information and attendance tracking

### Key Relationships

- Headquarters belong to countries
- Seasons operate within headquarters
- Agreements are linked to specific roles and headquarters
- Collaborators are assigned to headquarters with specific roles
- Students are associated with headquarters and seasons
- Workshops are led by facilitator collaborators at headquarters

## Main Features and UI Structure

### Authentication

- Secure login with email and password via Supabase
- Session management with auth state tracking
- Role-based access to features

### Dashboard

- Overview statistics (countries, headquarters, students, staff)
- Role-specific views with relevant metrics
- Quick access to key features

### Entity Management

- Countries with headquarters
- Headquarters with staff and programs
- Agreements for staff and participants
- Workshops and educational activities

### UI Components

- Consistent card-based interface with Taiga UI integration
- Generic table component for data display
- Sidebar navigation with role-based menu items
- Theme toggle (dark/light mode)
- Responsive design for various screen sizes

## Internationalization

The application supports multiple languages using ngx-translate:

- Translation files in `/public/i18n/` directory
- Currently supports English (en.json) and Spanish (es.json)
- UI elements and messages are internationalized

## Angular Development Guidelines

### Modern Angular Practices

This project uses Angular v19 with modern patterns and syntax. Always follow these guidelines:

#### Template Syntax

- **ALWAYS use new control flow syntax** instead of structural directives:

  ```html
  <!-- ✅ Use new control flow -->
  @if (condition) {
  <div>Content</div>
  } @for (item of items; track item.id) {
  <div>{{ item.name }}</div>
  } @switch (status) { @case ('active') { <span>Active</span> } @case ('inactive') { <span>Inactive</span> } @default {
  <span>Unknown</span> } }

  <!-- ❌ Don't use old structural directives -->
  <div *ngIf="condition">Content</div>
  <div *ngFor="let item of items; trackBy: trackByFn">{{ item.name }}</div>
  ```

- **Use template variables with new syntax**:
  ```html
  @let user = userService.currentUser(); @let isAdmin = user?.role === 'admin';
  ```

#### Component Architecture

- **Use OnPush change detection strategy** for all components
- **Use standalone components** exclusively (no NgModules)
- **Use signals** for reactive state management
- **Use computed signals** for derived state
- **Use effect()** for side effects, sparingly

#### Signals and Reactivity

- **Prefer signals over observables** for local component state
- **Use linkedSignal()** for dependent state that needs to be writable
- **Use resource()** for async data loading
- **Use computed()** for derived values
- **Avoid effect()** unless absolutely necessary for DOM manipulation or external APIs

Example patterns:

```typescript
export class ExampleComponent {
  // Input signals
  data = input.required<Data>();

  // State signals
  isLoading = signal(false);
  selectedItem = signal<Item | null>(null);

  // Computed signals
  filteredItems = computed(() => this.items().filter((item) => item.status === this.selectedStatus()));

  // Linked signals for dependent state
  processedData = linkedSignal(() => this.processData(this.data()));

  // Resource for async data
  users = resource({
    loader: () => this.userService.getUsers(),
  });

  // Output signals
  itemSelected = output<Item>();
}
```

#### Component Styling

- **Use inline styles with template literals** for component-specific styles
- **Leverage CSS custom properties** for theming
- **Use :host selector** for component root styling
- **Follow the established design system** (TaigaUI + Tailwind CSS)

#### Custom Events and Outputs

- **Use output()** function for component events
- **Use descriptive event names** that indicate the action
- **Emit minimal, focused data** in events

Example:

```typescript
export class UserCardComponent {
  userSelected = output<User>();
  userDeleted = output<string>(); // Just emit the ID

  onUserClick(user: User): void {
    this.userSelected.emit(user);
  }
}
```

#### Content Projection

- **Use ng-content** with select attributes for multiple slots
- **Use ng-template** for conditional content projection
- **Provide fallback content** when appropriate

#### Component Lifecycle

- **Use lifecycle hooks judiciously** with OnPush strategy
- **Prefer signals and computed values** over lifecycle hooks for reactive updates
- **Use afterNextRender()** for DOM manipulations
- **Use afterRender()** for cleanup that needs to happen after every render

### Code Style Guidelines

- **Use consistent naming conventions** following the style guide
- **Write descriptive component and method names**
- **Keep components focused and single-purpose**
- **Extract complex logic into services**
- **Use TypeScript strict mode features**
- **Leverage type inference** where possible

### Testing Patterns

- **Test component behavior**, not implementation details
- **Use component harnesses** for complex component testing
- **Mock external dependencies** properly
- **Write integration tests** for critical user flows

## Working with Docker

The project includes Docker configurations for both development and production:

- `docker-compose.dev.yaml`: Development with hot reloading
- `docker-compose.yaml`: Production setup with Nginx
