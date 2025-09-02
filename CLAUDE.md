## 🎯 Project Context

**Zambia** - Angular 19 + Nx monorepo for managing Akademia's multi-country educational organization.

### Tech Stack

- **Frontend**: Angular 19 (standalone components, signals, new control flow)
- **Build**: Nx 20 monorepo
- **Backend**: Supabase (PostgreSQL + Auth)
- **UI**: TaigaUI + Tailwind CSS
- taiga ui components docs here: https://github.com/taiga-family/taiga-ui/blob/main/projects/demo/src/llms.txt
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
firstName = model<string>(); // ModelSignal<string|undefined>
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
```

## 📐 Code Style Rules

1. **Components**: OnPush change detection, standalone only
2. **Templates**: New control flow syntax (@if, @for)
3. **State**: Signals over observables for local state
4. **Services**: Single responsibility, use facades for complex logic
5. **Testing**: Behavior over implementation

## 🎨 UI Guidelines

### Color System

- **Primary**: Sky (blue) - `bg-sky-600` light / `bg-sky-500` dark
- **Success**: Emerald - `bg-emerald-600` light / `bg-emerald-500` dark
- **Backgrounds**:
  - Light: `bg-white`, `bg-gray-50`
  - Dark: `dark:bg-slate-800`, `dark:bg-slate-900`
- **Cards**: Always include shadow + dark mode variants

### Key CSS Variables (in styles.css)

- Primary accent: `--tui-background-accent-1`
- Text colors: `--tui-text-primary`, `--tui-text-secondary`
- Status colors: `--tui-status-positive`, `--tui-status-negative`
- Custom scrollbar styling included

### Best Practices

1. **Always** include dark mode classes
2. **Use** gradient backgrounds for interactive elements
3. **Apply** consistent shadows with color tinting on hover
4. **Prefer** boxed glass pattern for modern cards
5. **Test** in both themes before committing
6. **Follow** MOBILE FIRST responsive design

### Form Styling

- **TUI Components**: Use TaigaUI form controls
- **Focus states**: Handled by TUI with sky-600 accent
- **Validation**: Use TUI error states with status colors

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
- **Commands**: [`docs/COMMANDS_REFERENCE.md`](docs/COMMANDS_REFERENCE.md)

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

### Quality Assurance Workflow

**ALWAYS run after making changes**:

```bash
npm run build && npm run lint:all
```

**Common linting fixes**:

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

**Remember**: When in doubt, check existing code patterns in the codebase first

## File Generation Guidelines

- **Do not modify `@libs/shared/types-supabase/src/lib/types/supabase.type.ts`** as this file is autogenerated

### Icon and Component Integration

- When you need to use icons you can look them here: https://lucide.dev/icons/
- With Taiga UI they are used like this:

```html
<tui-icon icon="@tui.heart" [style.color]="'var(--tui-status-negative)'" />
```
