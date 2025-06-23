# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🎯 Project Context

**Zambia** - Angular 19 + Nx monorepo for managing Akademia's multi-country educational organization.

# Angular Best Practices

This project adheres to modern Angular best practices, emphasizing maintainability, performance, accessibility, and scalability.

## TypeScript Best Practices

- **Strict Type Checking:** Always enable and adhere to strict type checking. This helps catch errors early and improves code quality.
- **Prefer Type Inference:** Allow TypeScript to infer types when they are obvious from the context. This reduces verbosity while maintaining type safety.
  - **Bad:**
    ```typescript
    let name: string = 'Angular';
    ```
  - **Good:**
    ```typescript
    let name = 'Angular';
    ```
- **Avoid `any`:** Do not use the `any` type unless absolutely necessary as it bypasses type checking. Prefer `unknown` when a type is uncertain and you need to handle it safely.

## Angular Best Practices

- **Standalone Components:** Always use standalone components, directives, and pipes. Avoid using `NgModules` for new features or refactoring existing ones.
- **Implicit Standalone:** When creating standalone components, you do not need to explicitly set `standalone: true` as it is implied by default when generating a standalone component.
  - **Bad:**
    ```typescript
    @Component({
      standalone: true,
      // ...
    })
    export class MyComponent {}
    ```
  - **Good:**
    ```typescript
    @Component({
      // `standalone: true` is implied
      // ...
    })
    export class MyComponent {}
    ```
- **Signals for State Management:** Utilize Angular Signals for reactive state management within components and services.
- **Lazy Loading:** Implement lazy loading for feature routes to improve initial load times of your application.
- **NgOptimizedImage:** Use `NgOptimizedImage` for all static images to automatically optimize image loading and performance.

## Components

- **Single Responsibility:** Keep components small, focused, and responsible for a single piece of functionality.
- **`input()` and `output()` Functions:** Prefer `input()` and `output()` functions over the `@Input()` and `@Output()` decorators for defining component inputs and outputs.

  - **Old Decorator Syntax:**
    ```typescript
    @Input() userId!: string;
    @Output() userSelected = new EventEmitter<string>();
    ```
  - **New Function Syntax:**

    ```typescript
    import { input, output } from '@angular/core';

    // ...
    userId = input<string>('');
    userSelected = output<string>();
    ```

- **`computed()` for Derived State:** Use the `computed()` function from `@angular/core` for derived state based on signals.
- **`ChangeDetectionStrategy.OnPush`:** Always set `changeDetection: ChangeDetectionStrategy.OnPush` in the `@Component` decorator for performance benefits by reducing unnecessary change detection cycles.
- **Inline Templates:** Prefer inline templates (template: `...`) for small components to keep related code together. For larger templates, use external HTML files.
- **Reactive Forms:** Prefer Reactive forms over Template-driven forms for complex forms, validation, and dynamic controls due to their explicit, immutable, and synchronous nature.
- **No `ngClass` / `NgClass`:** Do not use the `ngClass` directive. Instead, use native `class` bindings for conditional styling.
  - **Bad:**
    ```html
    <section [ngClass]="{'active': isActive}"></section>
    ```
  - **Good:**
    ```html
    <section [class.active]="isActive"></section>
    <section [class]="{'active': isActive}"></section>
    <section [class]="myClasses"></section>
    ```
- **No `ngStyle` / `NgStyle`:** Do not use the `ngStyle` directive. Instead, use native `style` bindings for conditional inline styles.
  - **Bad:**
    ```html
    <section [ngStyle]="{'font-size': fontSize + 'px'}"></section>
    ```
  - **Good:**
    ```html
    <section [style.font-size.px]="fontSize"></section>
    <section [style]="myStyles"></section>
    ```

## State Management

- **Signals for Local State:** Use signals for managing local component state.
- **`computed()` for Derived State:** Leverage `computed()` for any state that can be derived from other signals.
- **Pure and Predictable Transformations:** Ensure state transformations are pure functions (no side effects) and predictable.

## Templates

- **Simple Templates:** Keep templates as simple as possible, avoiding complex logic directly in the template. Delegate complex logic to the component's TypeScript code.
- **Native Control Flow:** Use the new built-in control flow syntax (`@if`, `@for`, `@switch`) instead of the older structural directives (`*ngIf`, `*ngFor`, `*ngSwitch`).
  - **Old Syntax:**
    ```html
    <section *ngIf="isVisible">Content</section>
    <section *ngFor="let item of items">{{ item }}</section>
    ```
  - **New Syntax:**
    ```html
    @if (isVisible) {
    <section>Content</section>
    } @for (item of items; track item.id) {
    <section>{{ item }}</section>
    }
    ```
- **Async Pipe:** Use the `async` pipe to handle observables in templates. This automatically subscribes and unsubscribes, preventing memory leaks.

## Services

- **Single Responsibility:** Design services around a single, well-defined responsibility.
- **`providedIn: 'root'`:** Use the `providedIn: 'root'` option when declaring injectable services to ensure they are singletons and tree-shakable.
- **`inject()` Function:** Prefer the `inject()` function over constructor injection when injecting dependencies, especially within `provide` functions, `computed` properties, or outside of constructor context.

  - **Old Constructor Injection:**
    ```typescript
    constructor(private myService: MyService) {}
    ```
  - **New `inject()` Function:**

    ```typescript
    import { inject } from '@angular/core';

    export class MyComponent {
      private myService = inject(MyService);
      // ...
    }
    ```

## for more info https://angular.dev/llms.txt

You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Don't use explicit `standalone: true` (it is implied by default)
- Use signals for state management
- Implement lazy loading for feature routes
- Use `NgOptimizedImage` for all static images.

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- DO NOT use `ngStyle`, use `style` bindings instead

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

### Tech Stack at a Glance

- **Frontend**: Angular 19 (standalone components, signals, new control flow)
- **Build**: Nx 20 monorepo
- **Backend**: Supabase (PostgreSQL + Auth)
- **UI**: TaigaUI + Tailwind CSS
- for taiga ui components you can check docs here: https://github.com/taiga-family/taiga-ui/blob/main/projects/demo/src/llms.txt
- ALWAYS check docs when you dont have enough context of examples
- **i18n**: ngx-translate (EN/ES)

## 🏗️ Architecture Quick Reference

```
apps/
├── zambia/          # Main app
└── zambia-e2e/      # E2E tests

libs/
├── shared/          # Cross-app libraries
│   ├── data-access-*    # Services & API
│   ├── ui-components/   # Reusable UI
│   ├── util-*          # Utilities
│   └── types-*         # TypeScript types
└── zambia/          # Feature modules
    └── feat-*       # Feature-specific
```

### Naming Conventions

- **Components**: `*.smart-component.ts` (containers) | `*.ui-component.ts` (presentational)
- **Services**: Inject with `inject()`, not constructors
- **Files**: kebab-case, descriptive names

## 🚀 Essential Commands

```bash
# Development
npm run dev                              # Start dev server
npm run build                           # Build app
npm run lint:all                        # Lint everything
npm test                               # Run tests

# Code Generation
npx nx g @nx/angular:library --name=feat-[name] --tags=scope:zambia,type:feat --directory=libs/zambia/feat-[name]
npx nx g @nx/angular:component --path=[path] --name=[name] --type=smart-component --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true

# Git & Quality
npm run cm                             # Commitizen (standardized commits)
npm run prettier:staged                # Format staged files

# Supabase Types
npm run supabase:gen:types:local       # Regenerate Supabase types
```

## 📋 Angular 19 Patterns

### ✅ ALWAYS Use

```typescript
// Dependency Injection
private authService = inject(AuthService);

// Signals
isLoading = signal(false);
filteredItems = computed(() => this.items().filter(item => item.active));

// Control Flow in Templates
@if (condition) { <div>Content</div> }
@for (item of items; track item.id) { <div>{{item.name}}</div> }
@switch

// Inputs/Outputs
data = input.required<Data>();
itemSelected = output<Item>();
import {model} from '@angular/core`;
firstName = model<string>();            // ModelSignal<string|undefined>
//  model declares a writeable signal that is exposed as an input/output pair on the containing directive.
  //  The input name is taken either from the class member or from the alias option. The output name is generated by taking the input name and appending Change.
```

### ❌ NEVER Use

```typescript
// Constructor injection
constructor(private service: Service) {}

// Old directives
*ngIf, *ngFor, *ngSwitch

// NgModules
@NgModule({...})
```

## 🔐 RBAC System

### Current Implementation

- **Auth**: Supabase with role in user metadata
- **Services**: `AuthService` → `RoleService`
- **Guards**: `authGuard`, `roleGuard`
- **Config**: Navigation in `ROLES_CONSTANTS.ts`

### Role Structure

```typescript
ROLE_GROUPS = {
  ADMINISTRATION: ['superadmin'],
  TOP_MANAGEMENT: ['general_director', 'executive_leader'],
  LEADERSHIP_TEAM: [...],
  HEADQUARTERS_MANAGEMENT: [...]
}
```

### Adding Features

1. Add to `NAVIGATION_CONFIG` in `ROLES_CONSTANTS.ts`
2. Add to `NAVIGATION_SECTIONS`
3. Add translations to `i18n/*.json`
4. Add route with `roleGuard`

## 🛠️ Common Tasks

### Add New Feature Module

```bash
# 1. Generate library
npx nx g @nx/angular:library --name=feat-example --tags=scope:zambia,type:feat --directory=libs/zambia/feat-example

# 2. Generate smart component
npx nx g @nx/angular:component --path=libs/zambia/feat-example/src/lib/components/smart --name=example --type=smart-component --changeDetection=OnPush --inlineStyle=true --inlineTemplate=true

# 3. Add navigation (see RBAC section)
```

### Fix Common Issues

**Import Paths**

```typescript
// Use @zambia/* paths
import { AuthService } from '@zambia/data-access-auth';
```

## 📐 Code Style Rules

1. **Components**: OnPush change detection, standalone only
2. **Templates**: New control flow syntax (@if, @for)
3. **State**: Signals over observables for local state
4. **Services**: Single responsibility, use facades for complex logic
5. **Testing**: Behavior over implementation

## 🎨 UI Guidelines

### Core Stack

- **Framework**: TaigaUI components + Tailwind CSS v4
- **Fonts**: Source Sans Pro (primary), Source Serif Pro (highlights)
- **Theme**: Dark/light mode with `ThemeService` + custom TaigaUI overrides
- **Icons**: Lucide icons via TUI

### Color System

- **Primary**: Sky (blue) - `bg-sky-600` light / `bg-sky-500` dark
- **Success**: Emerald - `bg-emerald-600` light / `bg-emerald-500` dark
- **Backgrounds**:
  - Light: `bg-white`, `bg-gray-50`
  - Dark: `dark:bg-slate-800`, `dark:bg-slate-900`
- **Cards**: Always include shadow + dark mode variants

### Spacing & Layout

- **Page sections**: `px-6 py-8 sm:px-8`
- **Cards**: `p-4` or `p-6` with `rounded-lg`
- **Form groups**: `space-y-4`
- **Grid responsive**: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`

### Typography Scale

- **H1**: `text-2xl font-bold` / `text-3xl sm:text-4xl` (hero)
- **H2**: `text-xl font-semibold`
- **H3**: `text-lg font-semibold`
- **Body**: Base size (no class)
- **Small**: `text-sm`
- **Stats**: `text-2xl font-bold`

### Key CSS Variables (in styles.css)

- Primary accent: `--tui-background-accent-1`
- Text colors: `--tui-text-primary`, `--tui-text-secondary`
- Status colors: `--tui-status-positive`, `--tui-status-negative`
- Custom scrollbar styling included

### Boxed Glass Design System

**Modern glass morphism** pattern with clean geometric shapes:

- **Glass Effects**: Semi-transparent backgrounds (`bg-white/90`) + backdrop blur
- **Enhanced Shadows**: Multi-layered with color tinting (`shadow-lg shadow-gray-900/5`)
- **Subtle Borders**: Transparent overlays (`border-gray-200/50`)
- **Smooth Interactions**: Extended transitions (`duration-300`) + hover scale

```html
<!-- Boxed Glass Pattern -->
<div
  class="rounded-2xl border border-gray-200/50 bg-white/90 shadow-lg shadow-gray-900/5 backdrop-blur-sm hover:shadow-xl dark:border-slate-700/50 dark:bg-slate-800/90"
></div>
```

### Best Practices

1. **Always** include dark mode classes
2. **Use** gradient backgrounds for interactive elements
3. **Apply** consistent shadows with color tinting on hover
4. **Prefer** boxed glass pattern for modern cards
5. **Test** in both themes before committing
6. **Follow** mobile-first responsive design

### Form Styling

- **TUI Components**: Use TaigaUI form controls
- **Focus states**: Handled by TUI with sky-600 accent
- **Validation**: Use TUI error states with status colors

## 📚 Key Services

### Core Services

- `AuthService` - Authentication state
- `RoleService` - Role checks & navigation
- `SupabaseService` - Database connection
- `ThemeService` - Theme management

### Feature Services

- `CountriesFacadeService` - Countries management
- `HeadquartersFacadeService` - HQ operations
- `WorkshopsFacadeService` - Workshop scheduling
- `AgreementsFacadeService` - Agreement tracking

## 🔍 Quick Debugging

```bash
# Check circular dependencies
npx nx graph

# Clear cache if weird errors
npx nx reset
```

## 🤖 AI Integration (Nx MCP)

**Nx MCP Server** provides deep workspace context to AI assistants:

```bash
# Enable MCP for enhanced AI capabilities
npx nx-mcp@latest /mnt/c/Developer/zambia

# Available AI tools via MCP:
# - nx_workspace: Project graph and configuration
# - nx_project_details: Specific project info
# - nx_docs: Contextual Nx documentation
# - nx_generators: Available code generators
# - nx_visualize_graph: Interactive project graphs
```

## 📖 Documentation

- **UI Style Guide**: [`libs/shared/ui-components/STYLE_GUIDE.md`](libs/shared/ui-components/STYLE_GUIDE.md)
- **Angular Guidelines**: [`docs/ANGULAR_GUIDELINES.md`](docs/ANGULAR_GUIDELINES.md)
- **Development**: [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md)
- **Database Schema**: [`docs/DATABASE.md`](docs/DATABASE.md)
- **Nx MCP Integration**: [`docs/NX_MCP.md`](docs/NX_MCP.md)
- **Commands **: [`docs/COMMANDS_REFERENCE.md`](docs/COMMANDS_REFERENCE.md)

## ⚡ Performance Tips

1. Use `@defer` for heavy components
2. TrackBy functions in @for loops
3. OnPush change detection everywhere
4. Lazy load feature modules
5. Use computed() for derived state

## 🔄 Git Workflow

### **Commit Standards**

- **Types**: feat, fix, docs, style, refactor, perf, test, chore, ci, build
- **Always commit** completed work with semantic messages
- **Include** detailed bullet points explaining changes

### **Commit Message Format**

```
type(scope): brief description

- Detailed explanation of changes and their impact
- Focus on the "why" rather than the "what"
- Include motivation and reasoning behind changes

```

### **Workflow Steps**

1. Make and test changes
2. Run linting/type checking if needed
3. Stage files with `git add`
4. Commit with semantic message
5. **Wait for user instruction** before any `git push`

## 🎓 Common Errors & Solutions

### Nx Library Generation Errors

**Error**: "Schema does not support positional arguments"

```bash
# ❌ Wrong
npx nx g @nx/angular:library feat-home

# ✅ Correct - Always use named parameters
npx nx g @nx/angular:library --name=feat-home --tags=scope:zambia,type:feat --directory=libs/zambia/feat-home
```

**Error**: Library created in wrong directory structure

- Always specify the full `--directory` parameter
- Check `tsconfig.base.json` paths after generation

### Taiga UI Import Errors

**Error**: "Module 'TuiLoaderModule' has no exported member"

```typescript
// ❌ Wrong - Old module approach
import { TuiLoaderModule } from '@taiga-ui/core';

// ✅ Correct - Import standalone components directly
import { TuiLoader } from '@taiga-ui/core';
```

### Service API Patterns

**Error**: "Property 'currentUser' does not exist on type 'AuthService'"

```typescript
// ❌ Wrong - Assumed API
const user = this.authService.currentUser();

// ✅ Correct - Check actual implementation
const session = this.authService.session();
const user = session()?.user;
```

**Error**: "Property 'client' does not exist on type 'SupabaseService'"

```typescript
// ❌ Wrong
const client = this.supabaseService.client;

// ✅ Correct
const client = this.supabaseService.getClient();
```

### Cross-Project Development

**THIS IS THE BACKEND DIRECTORY**: Working with both Zambia and Supabase projects

```bash
 /home/mcpo/developer/supabase/
```

### Quality Assurance Workflow

**ALWAYS run after making changes**:

```bash
npm run build && npm run lint:all
```

**Common linting fixes**:

- Use `// eslint-disable-next-line @typescript-eslint/no-explicit-any` only when absolutely necessary
- Remove unused imports immediately
- Check service APIs before assuming methods exist

## 🚨 Critical Rules

1. **NEVER** commit secrets or API keys
2. **NEVER** push to remote without explicit user request
3. **ALWAYS** use type safety (no `any` without eslint exception)
4. **FOLLOW** existing patterns in codebase
5. **TEST** before committing (build + lint)
6. **USE** semantic commit messages
7. **CHECK** existing service implementations before assuming APIs

---

**Remember**: When in doubt, check existing code patterns in the codebase first!

### Icon and Component Integration

- When you need to use icons you can look them here: https://lucide.dev/icons/
- With Taiga UI they are used like this:

```html
<tui-icon icon="@tui.heart" [style.color]="'var(--tui-status-negative)'" />
```
