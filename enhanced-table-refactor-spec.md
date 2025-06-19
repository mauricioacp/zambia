# Enhanced Table Refactoring Specification

## Executive Summary

This specification outlines the refactoring of the enhanced table UI component into a modern, scalable, and maintainable multi-layered architecture. The new system will feature improved search capabilities using PostgreSQL's tsvector, proper separation of concerns, and strict TypeScript typing while following Angular 19 best practices.

## Architecture Overview

### Three-Layer Component Architecture

```
┌─────────────────────────────────────────┐
│    Top Layer: Smart Tables              │
│  (AgreementsSmartTable, etc.)           │
├─────────────────────────────────────────┤
│    Middle Layer: Enhanced Table         │
│  (Search, Filters, Composed Features)   │
├─────────────────────────────────────────┤
│    Base Layer: Table Primitives        │
│  (Pagination, Column Toggle, etc.)      │
└─────────────────────────────────────────┘
```

## Component Breakdown

### Base Layer: Table Primitives

#### 1. PaginationUiComponent

- **Purpose**: Reusable pagination control
- **Features**:
  - Page navigation (first, prev, next, last)
  - Items per page selector with working dropdown
  - "Showing X-Y of Z" display
  - Configurable page size options
- **Inputs**:
  ```typescript
  currentPage = input.required<number>();
  totalPages = input.required<number>();
  pageSize = input.required<number>();
  totalItems = input.required<number>();
  pageSizeOptions = input<number[]>([10, 25, 50, 100]);
  ```
- **Outputs**:
  ```typescript
  pageChange = output<number>();
  pageSizeChange = output<number>();
  ```

#### 2. ColumnVisibilityUiComponent

- **Purpose**: Toggle column visibility
- **Features**:
  - Dropdown with checkboxes for each column
  - "Show All" / "Hide All" actions
  - Persist preferences in localStorage
- **Inputs**:
  ```typescript
  columns = input.required<ColumnConfig[]>();
  visibleColumns = input.required<Set<string>>();
  ```
- **Outputs**:
  ```typescript
  visibilityChange = output<Set<string>>();
  ```

#### 3. TableHeaderUiComponent

- **Purpose**: Reusable table header with actions
- **Features**:
  - Title and description
  - Action buttons slot
  - Consistent styling
- **Inputs**:
  ```typescript
  title = input<string>('');
  description = input<string>('');
  ```
- **Content Projection**: Actions slot

#### 4. EmptyStateUiComponent

- **Purpose**: Display when no data
- **Features**:
  - Icon, title, description
  - Optional action button
- **Inputs**:
  ```typescript
  icon = input<string>('@tui.inbox');
  title = input.required<string>();
  description = input<string>('');
  actionLabel = input<string>('');
  ```
- **Outputs**:
  ```typescript
  action = output<void>();
  ```

#### 5. LoadingStateUiComponent

- **Purpose**: Skeleton loading state
- **Features**:
  - Configurable rows/columns
  - Animated skeleton effect
- **Inputs**:
  ```typescript
  rows = input<number>(5);
  columns = input<number>(4);
  ```

### Middle Layer: Enhanced Table

#### EnhancedTableUiComponent (Refactored)

- **Purpose**: Compose base components into a feature-rich table
- **Key Changes**:
  - Remove methods from template (use pipes/directives)
  - Better TypeScript types
  - Modular architecture
- **Features**:
  - Column visibility management
  - Client-side search/filter
  - Sorting
  - Row actions
  - Loading/empty states
  - Responsive design
- **New Pipes**:

  ```typescript
  @Pipe({ name: 'tableSearch' })
  export class TableSearchPipe

  @Pipe({ name: 'tableSort' })
  export class TableSortPipe
  ```

- **New Directives**:

  ```typescript
  @Directive({ selector: '[zTableRowClick]' })
  export class TableRowClickDirective

  @Directive({ selector: '[zTableActionVisible]' })
  export class TableActionVisibleDirective
  ```

### Top Layer: Agreement-Specific Components

#### 1. AgreementSearchModalUiComponent

- **Purpose**: Full-text search for agreements
- **Features**:
  - TuiDialog modal
  - Search input with 300ms debounce
  - Real-time tsvector search results
  - Scrollable results list
  - Single-select with icon button
- **Template Structure**:
  ```html
  <tui-dialog>
    <div class="p-6">
      <h3>{{ 'search_agreements' | translate }}</h3>
      <p>{{ 'search_by_name_description' | translate }}</p>

      <tui-input
        [(ngModel)]="searchQuery"
        [tuiTextfieldLabelOutside]="true"
        placeholder="{{ 'enter_name_or_lastname' | translate }}"
      >
        <tui-icon tuiTextfieldPrefix icon="@tui.search"></tui-icon>
      </tui-input>

      <div class="mt-4 max-h-96 overflow-y-auto">
        @if (isSearching()) {
        <tui-loader></tui-loader>
        } @else if (searchResults().length === 0 && searchQuery()) {
        <z-empty-state [title]="'no_results' | translate" [description]="'try_different_search' | translate" />
        } @else { @for (result of searchResults(); track result.id) {
        <div class="result-item">
          <!-- Agreement details -->
          <button tuiIconButton (click)="selectAgreement(result)">
            <tui-icon icon="@tui.arrow-right"></tui-icon>
          </button>
        </div>
        } }
      </div>
    </div>
  </tui-dialog>
  ```

#### 2. RoleFilterSelectorUiComponent

- **Purpose**: Dedicated role filter component
- **Features**:
  - All roles from ROLES_CONSTANTS
  - Proper filtering logic
  - Type-safe role handling
- **Implementation Note**: Fix the incomplete role filtering by including all role types

#### 3. AgreementsSmartTableComponent

- **Purpose**: Compose all components for agreements
- **Features**:
  - Search button opening modal
  - Role filter selector
  - Enhanced table with agreement-specific config
  - Predefined action templates
  - Column visibility defaults
- **Structure**:
  ```typescript
  template: `
    <z-table-header
      [title]="'agreements_list' | translate"
      [description]="'manage_agreements' | translate"
    >
      <div actions class="flex gap-3">
        <button tuiButton (click)="openSearchModal()">
          {{ 'search' | translate }}
        </button>
        <z-role-filter-selector
          [(selectedRole)]="roleFilter"
          [roles]="availableRoles"
        />
      </div>
    </z-table-header>
    
    <z-enhanced-table
      [data]="filteredData()"
      [columns]="tableColumns"
      [actions]="tableActions"
      [defaultVisibleColumns]="defaultColumns"
    />
  `;
  ```

## Implementation Details

### Search Implementation

#### Backend Query

```typescript
// In AgreementsFacadeService
async searchAgreements(query: string): Promise<Agreement[]> {
  const { data, error } = await this.supabase
    .from('agreements')
    .select(`
      id, name, last_name, email, status,
      role:roles(id, role_name),
      headquarter:headquarters(id, name)
    `)
    .textSearch('fts_name_lastname', query)
    .limit(20);

  return data || [];
}
```

#### Search Modal Service

```typescript
@Injectable()
export class AgreementSearchService {
  private searchQuery = signal('');
  private searchResults = signal<Agreement[]>([]);

  searchAgreements = effect(() => {
    const query = this.searchQuery();
    if (query.length >= 2) {
      untracked(() => this.performSearch(query));
    }
  });

  private async performSearch(query: string) {
    // Implement debounced search
  }
}
```

### Column Configuration

```typescript
interface AgreementColumnConfig {
  // Always visible
  alwaysVisible: ['name', 'email', 'role', 'status', 'headquarter', 'actions'];

  // Hidden by default
  hiddenByDefault: [
    'documentNumber',
    'phone',
    'address',
    'birthDate',
    'gender',
    'volunteeringAgreement',
    'ethicalDocumentAgreement',
    'mailingAgreement',
    'ageVerification',
    'activationDate',
    'createdAt',
    'updatedAt',
  ];
}
```

### Type Definitions

```typescript
// Base types
interface TableColumn {
  key: string;
  label: string;
  type: 'text' | 'avatar' | 'badge' | 'status' | 'actions' | 'custom' | 'date';
  sortable?: boolean;
  searchable?: boolean;
  width?: number;
  align?: 'left' | 'center' | 'right';
  visible?: boolean;
  alwaysVisible?: boolean;
}

interface TableAction<T> {
  label: string;
  icon: string;
  color: 'primary' | 'secondary' | 'warning' | 'danger';
  handler: (item: T) => void;
  visible?: (item: T) => boolean;
  disabled?: (item: T) => boolean;
  template?: TemplateRef<any>; // New: support custom templates
}

interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// Agreement-specific types
interface AgreementTableData {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role: string;
  roleId: string;
  status: 'active' | 'inactive' | 'prospect' | 'graduated';
  headquarter: string;
  headquarterId: string;
  // Optional fields
  documentNumber?: string;
  phone?: string;
  address?: string;
  birthDate?: Date;
  gender?: 'male' | 'female' | 'other' | 'unknown';
  volunteeringAgreement?: boolean;
  ethicalDocumentAgreement?: boolean;
  mailingAgreement?: boolean;
  ageVerification?: boolean;
  activationDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}
```

### Styling Guidelines

All components will follow the established boxed glass design system using Tailwind utility classes directly in templates:

```typescript
// Glass card style classes
const glassCardClasses =
  'rounded-2xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm transition-all duration-300 hover:border-gray-300/70 hover:shadow-xl hover:shadow-gray-900/10 dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20 dark:hover:border-slate-600/70 dark:hover:shadow-slate-900/40';

// Search result item classes
const searchResultItemClasses =
  'flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors duration-200';
```

Components will use these class strings directly in their templates or define them as component properties for reusability.

## Migration Strategy

### Phase 1: Create Base Components

1. Build all base layer components with tests
2. Ensure TaigaUI integration
3. Document component APIs

### Phase 2: Refactor Enhanced Table

1. Extract search/filter logic to pipes
2. Create directives for template logic
3. Improve type safety
4. Fix pagination dropdown issue

### Phase 3: Build Agreement Components

1. Create search modal with tsvector integration
2. Build role filter with all roles
3. Compose AgreementsSmartTable
4. Add new action templates (PDF download)

### Phase 4: Testing & Documentation

1. Unit tests for all components
2. Integration tests for search functionality
3. Update Storybook stories
4. Create usage documentation

## Performance Considerations

- **Debounce search**: 300ms delay
- **Virtual scrolling**: For large result sets
- **Memoization**: Use computed() for filtered data
- **Lazy loading**: Defer non-critical components
- **Change detection**: OnPush everywhere

## Accessibility

- Keyboard navigation for all interactive elements
- ARIA labels for screen readers
- Focus management in modals
- High contrast mode support

## Future Enhancements

1. **Export functionality**: Built into table header
2. **Bulk actions**: Select multiple rows
3. **Advanced filters**: Date ranges, multiple criteria
4. **Saved views**: User preferences
5. **Real-time updates**: WebSocket integration

## Success Criteria

- [ ] Pagination dropdown works correctly
- [ ] All roles appear in filter
- [ ] Search uses tsvector efficiently
- [ ] No methods in templates
- [ ] 100% TypeScript coverage
- [ ] All components use OnPush
- [ ] Follows Angular 19 patterns
- [ ] Maintains current functionality
- [ ] Improves performance
- [ ] Clear documentation

## Technical Debt Addressed

1. Fix role filter to include all roles
2. Resolve pagination dropdown issue
3. Remove template methods
4. Improve type safety
5. Better separation of concerns
6. Consistent error handling

## Dependencies

- Angular 19
- TaigaUI
- Supabase client
- RxJS
- TypeScript 5.x

## Timeline Estimate

- Base components: 2 days
- Enhanced table refactor: 3 days
- Agreement components: 2 days
- Testing & documentation: 2 days
- **Total**: ~9 days

---

This specification provides a clear roadmap for refactoring the enhanced table into a modern, maintainable component system that addresses all current issues while setting the foundation for future enhancements.
