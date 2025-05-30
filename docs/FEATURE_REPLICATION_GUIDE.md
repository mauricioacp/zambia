# 🎯 Complete Feature Module Replication Guide

Based on the Countries feature analysis, this comprehensive template allows you to recreate any feature (Headquarters, Workshops, Agreements, etc.) with the exact same high-quality patterns, excellent UX, and comprehensive functionality.

## 📊 **DATABASE ANALYSIS & FEATURE CATEGORIZATION**

### **Simple Features** (Standard CRUD)

- **Countries**: `name`, `code`, `status` - Basic entity management
- **Headquarters**: `name`, `address`, `contact_info`, `status` - Location management
- **Roles**: `name`, `code`, `description`, `level`, `permissions` - Configuration
- **Seasons**: `name`, `start_date`, `end_date`, `status` - Time periods

### **Complex Features** (Rich Data & Relations)

- **Agreements**: 20+ fields including personal data, documents, verification flags
- **Scheduled Workshops**: DateTime ranges, facilitator assignment, location details
- **Students**: Enrollment tracking, progress comments, multi-relationship
- **Events**: Complex event management with types, JSON data, time ranges

### **High-Volume Features** (Require Pagination)

- **Agreements**: Thousands of records - Use `get_agreements_with_role_paginated` function
- **Student Attendance**: High-frequency records per workshop
- **Audit Log**: System-wide logging records

## 📋 **FEATURE DEVELOPMENT CHECKLIST**

### **Phase 1: Database Analysis & Planning**

#### ✅ **1.1 Schema Analysis**

- [ ] **Examine Entity Structure** in `@libs/shared/types-supabase/src/lib/types/supabase.type.ts`
  ```typescript
  // Example for any feature
  Database['public']['Tables']['your_feature']['Row'];
  Database['public']['Tables']['your_feature']['Insert'];
  Database['public']['Tables']['your_feature']['Update'];
  ```
- [ ] **Identify Field Complexity**:

  - [ ] Simple: `name`, `code`, `status` (Standard form fields)
  - [ ] Complex: `contact_info: Json`, `permissions: Json` (Custom components needed)
  - [ ] Dates: `start_date`, `end_date` (Date pickers required)
  - [ ] Relations: Foreign keys to other tables (Dropdowns/selects needed)

- [ ] **Check Relationships**: Look for `Relationships` array to identify:

  - [ ] Parent entities (for breadcrumbs and navigation)
  - [ ] Child entities (for detail view tables)
  - [ ] Many-to-many relations (for assignment features)

- [ ] **Volume Assessment**:
  - [ ] **Low Volume** (<100 records): Disable pagination, simple loading
  - [ ] **Medium Volume** (100-1000): Enable pagination with standard page sizes
  - [ ] **High Volume** (1000+): Check for specialized functions like `get_agreements_with_role_paginated`

#### ✅ **1.2 Feature Planning**

- [ ] **UI Complexity Assessment**:
  - [ ] **Simple**: Name, code, status → Standard form modal
  - [ ] **Medium**: + Address, contact info → Larger modal with sections
  - [ ] **Complex**: + Multiple relations, JSON fields → Multi-step wizard or tabbed interface

### **Phase 2: Data Architecture & Service Layer**

#### ✅ **2.1 Facade Service Setup** (`{feature}-facade.service.ts`)

- [ ] **Type Definitions**

  ```typescript
  export type {Entity} = Database['public']['Tables']['{table}']['Row'];
  export type {Entity}Insert = Database['public']['Tables']['{table}']['Insert'];
  export type {Entity}Update = Database['public']['Tables']['{table}']['Update'];

  // For related entities (check Relationships in schema)
  export type Related = Database['public']['Tables']['{related_table}']['Row'];

  // Compound interface for entities with relations
  export interface {Entity}WithRelated extends {Entity} {
    related_entities: Related[];
  }

  // Form data interface (extract only editable fields)
  export interface {Entity}FormData {
    name: string;
    // Add only fields that appear in Insert/Update types
    // Exclude: id, created_at, updated_at (auto-generated)
  }
  ```

- [ ] **Signal-Based State Management**

  ```typescript
  entityId: WritableSignal<string> = signal('');
  entitiesResource = linkedSignal(() => this.entities.value() ?? []);
  entityByIdResource = linkedSignal(() => this.entityById.value() ?? null);
  ```

- [ ] **Resource Loaders**

  - [ ] **Simple List Resource** (for low-volume features):

    ```typescript
    entities = resource({
      loader: async () => {
        const { data, error } = await this.supabase
          .getClient()
          .from('{table}')
          .select('id, name, code, status') // Select only needed fields
          .order('name');

        if (error) throw error;
        return data as { Entity }[];
      },
    });
    ```

  - [ ] **Paginated List Resource** (for high-volume features like agreements):

    ```typescript
    // Check if database has specialized pagination functions
    entities = resource({
      request: () => ({ page: this.currentPage(), pageSize: this.pageSize() }),
      loader: async ({ request }) => {
        // Use specialized function if available (like get_agreements_with_role_paginated)
        const { data, error } = await this.supabase.getClient().rpc('get_{table}_paginated', {
          p_limit: request.pageSize,
          p_offset: request.page * request.pageSize,
        });

        if (error) throw error;
        return data;
      },
    });
    ```

  - [ ] **Detail Resource with Relations**:

    ```typescript
    entityById = resource({
      request: () => (this.entityId() ? { entityId: this.entityId() } : undefined),
      loader: async ({ request }) => {
        if (!request) return null;

        const { data, error } = await this.supabase
          .getClient()
          .from('{table}')
          .select(`
            *,
            related_table(*) // Include related data based on Relationships
          `)
          .eq('id', request.entityId)
          .single();

        if (error) throw error;
        return data as {Entity}WithRelated;
      },
    });
    ```

- [ ] **Computed States**

  ```typescript
  isLoading = computed(() => this.entities.isLoading());
  loadingError = computed(() => this.entities.error());
  isDetailLoading = computed(() => this.entityById.isLoading());
  detailLoadingError = computed(() => this.entityById.error());
  ```

- [ ] **CRUD Operations**

  ```typescript
  async create{Entity}(data: {Entity}FormData): Promise<{Entity}> {
    const { data: result, error } = await this.supabase
      .getClient()
      .from('{table}')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    this.entities.reload(); // Refresh list
    return result as {Entity};
  }

  async update{Entity}(id: string, data: Partial<{Entity}FormData>): Promise<{Entity}> {
    const { data: result, error } = await this.supabase
      .getClient()
      .from('{table}')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    this.entities.reload();
    if (this.entityId() === id) this.entityById.reload();
    return result as {Entity};
  }

  async delete{Entity}(id: string): Promise<void> {
    const { error } = await this.supabase
      .getClient()
      .from('{table}')
      .delete()
      .eq('id', id);

    if (error) throw error;
    this.entities.reload();
  }
  ```

---

### **Phase 3: List Component** (`{feature}s-list.smart-component.ts`)

#### ✅ **3.1 Component Structure & Dependencies**

```typescript
@Component({
  selector: 'z-{features}-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, TranslatePipe,
    EnhancedTableUiComponent, TuiIcon, TuiButton, TuiLink,
    TuiBreadcrumbs, TuiItem, TuiSkeleton, HasRoleDirective,
  ],
  // ... rest of component
})
export class {Feature}sListSmartComponent {
  protected {feature}sFacade = inject({Feature}sFacadeService);
  private translate = inject(TranslateService);
  private dialogService = inject(TuiDialogService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private exportService = inject(ExportService);
  private roleService = inject(RoleService);

  isProcessing = signal(false);
  currentTheme = injectCurrentTheme();
  ICONS = ICONS;
}
```

#### ✅ **3.2 Header Section with Breadcrumbs**

```html
<div class="min-h-screen bg-gray-50 dark:bg-slate-800">
  <!-- Header Section -->
  <div class="border-b border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
    <div class="container mx-auto px-6 py-6">
      <!-- Breadcrumbs -->
      <tui-breadcrumbs class="mb-6">
        <a *tuiItem routerLink="/dashboard" tuiLink iconStart="@tui.house"> {{ 'dashboard' | translate }} </a>
        <span *tuiItem>{{ '{features}' | translate }}</span>
      </tui-breadcrumbs>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 shadow-lg">
            <tui-icon [icon]="ICONS.{FEATURE_ICON}" class="text-3xl text-white"></tui-icon>
          </div>
          <div>
            <h1 class="mb-1 text-3xl font-bold text-gray-800 dark:text-white">{{ '{features}' | translate }}</h1>
            <p class="text-gray-600 dark:text-slate-400">{{ '{features}_description' | translate }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button
            tuiButton
            appearance="secondary"
            size="l"
            iconStart="@tui.download"
            (click)="onExport{Features}()"
            [disabled]="isProcessing() || !statsData()?.total"
          >
            {{ 'export' | translate }}
          </button>
          <button
            *zHasRole="allowedRolesFor{Feature}Creation()"
            tuiButton
            appearance="primary"
            size="l"
            iconStart="@tui.plus"
            (click)="onCreate{Feature}()"
            [disabled]="isProcessing()"
          >
            {{ 'create_{feature}' | translate }}
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
```

#### ✅ **3.3 Statistics Cards**

```typescript
// Adapt based on your entity's data structure
statsData = computed(() => {
  const items = this.{feature}sFacade.entitiesResource();
  if (!items || items.length === 0) return null;

  return {
    total: items.length,
    active: items.filter(i => i.status === 'active').length,
    inactive: items.filter(i => i.status === 'inactive').length,
    // Add feature-specific metrics based on schema fields
    // For workshops: scheduled vs completed
    // For agreements: by role type
    // For students: by enrollment status
  };
});
```

#### ✅ **3.4 Enhanced Table Configuration**

```typescript
tableColumns = computed((): TableColumn[] => [
  // Standard columns for most features
  {
    key: 'name',
    label: this.translate.instant('name'),
    type: 'avatar', // Use avatar for main identifier
    sortable: true,
    searchable: true
  },

  // Adapt based on schema analysis:
  // Simple features: code field
  {
    key: 'code',
    label: this.translate.instant('code'),
    type: 'badge',
    sortable: true,
    searchable: true
  },

  // Complex features: choose most important secondary field
  // For headquarters: address
  // For workshops: start_datetime
  // For agreements: email or role
  {
    key: 'important_field',
    label: this.translate.instant('field_label'),
    type: 'text',
    sortable: true
  },

  // Status column (if exists in schema)
  {
    key: 'status',
    label: this.translate.instant('status'),
    type: 'status',
    sortable: true
  },

  // Actions column
  {
    key: 'actions',
    label: this.translate.instant('actions'),
    type: 'actions',
    align: 'center'
  },
]);

tableActions = computed((): TableAction<{Entity}>[] => [
  {
    label: this.translate.instant('view'),
    icon: '@tui.eye',
    color: 'primary',
    handler: (item: {Entity}) => this.onView{Feature}(item),
  },
  {
    label: this.translate.instant('edit'),
    icon: '@tui.pencil',
    color: 'warning',
    handler: (item: {Entity}) => this.onEdit{Feature}(item),
    disabled: () => this.isProcessing(),
    visible: () => this.hasEditAccess(),
  },
  {
    label: this.translate.instant('delete'),
    icon: '@tui.trash',
    color: 'danger',
    handler: (item: {Entity}) => this.onDelete{Feature}(item),
    disabled: () => this.isProcessing(),
    visible: () => this.hasDeleteAccess(),
  },
]);
```

#### ✅ **3.5 Enhanced Table Integration**

```html
<z-enhanced-table
  [items]="{feature}sFacade.entitiesResource()"
  [columns]="tableColumns()"
  [actions]="tableActions()"
  [loading]="{feature}sFacade.isLoading() || isProcessing()"
  [emptyStateTitle]="'no_{features}_found' | translate"
  [emptyStateDescription]="'no_{features}_description' | translate"
  [emptyStateIcon]="'@tui.{icon}'"
  [enablePagination]="shouldEnablePagination()" // Based on volume analysis
  [enableFiltering]="true"
  [enableColumnVisibility]="true"
  [pageSize]="getOptimalPageSize()" // 10 for simple, 25+ for complex
  [searchableColumns]="searchableColumns()"
  (rowClick)="onRowClick($event)"
/>
```

```typescript
// Pagination strategy based on data volume
shouldEnablePagination = computed(() => {
  const items = this.{feature}sFacade.entitiesResource();
  return items && items.length > 50; // Enable for larger datasets
});

getOptimalPageSize = computed(() => {
  // Simple entities: 10-15 per page
  // Complex entities with many columns: 25 per page
  // High-volume (agreements): 50 per page
  return 25;
});

searchableColumns = computed(() => {
  // Based on schema analysis, include text fields that users would search
  return ['name', 'code', 'email']; // Adapt to your entity
});
```

---

### **Phase 4: Detail Component** (`{feature}-detail.smart-component.ts`)

#### ✅ **4.1 Component Setup**

```typescript
export class {Feature}DetailSmartComponent {
  protected {feature}sFacade = inject({Feature}sFacadeService);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private dialogService = inject(TuiDialogService);

  {feature}Id = input.required<string>();
  {feature}Data: WritableSignal<{Entity}WithRelated | null> = signal(null);
  isProcessing = signal(false);

  ICONS = ICONS;
}
```

#### ✅ **4.2 Information Cards Grid**

```typescript
// Generate cards based on schema analysis
// Simple entities: 3 cards (code, status, related count)
// Complex entities: 4-6 cards (key metrics)

// Example for different entity types:
getInfoCards = computed(() => {
  const entity = this.{feature}Data();
  if (!entity) return [];

  return [
    // Standard cards for most entities
    {
      title: 'code',
      value: entity.code,
      icon: '@tui.code',
      color: 'blue',
      type: 'mono' // For codes/identifiers
    },
    {
      title: 'status',
      value: entity.status,
      icon: '@tui.activity',
      color: entity.status === 'active' ? 'green' : 'red',
      type: 'status'
    },

    // Add feature-specific cards based on schema
    // For headquarters: country, address
    // For workshops: facilitator, duration
    // For agreements: role, verification status
    // For students: enrollment date, progress
  ];
});
```

#### ✅ **4.3 Related Data Section**

```typescript
// Based on Relationships in schema, show related entities
relatedEntitiesColumns = computed((): TableColumn[] => {
  // Example: Countries → Headquarters
  // Workshops → Attendance records
  // Agreements → Related user data
  return [
    { key: 'name', label: this.translate.instant('name'), type: 'text', searchable: true },
    { key: 'status', label: this.translate.instant('status'), type: 'status' },
    { key: 'actions', label: this.translate.instant('actions'), type: 'actions' },
  ];
});

relatedEntitiesActions = computed((): TableAction<any>[] => [
  {
    label: this.translate.instant('view'),
    icon: '@tui.eye',
    color: 'primary',
    handler: (item) => this.onRelatedView(item),
  },
]);
```

---

### **Phase 5: Form Modal Component** (`{feature}-form-modal.smart-component.ts`)

#### ✅ **5.1 Form Field Generation**

```typescript
// Generate form based on Insert/Update schema types
constructor() {
  const entity = this.context.data;
  this.isEditMode.set(!!entity);

  // Build form based on schema analysis
  this.form = this.fb.group({
    // Standard fields for most entities
    name: [entity?.name || '', [Validators.required, Validators.minLength(2)]],

    // Conditional fields based on schema
    // Simple entities
    code: [entity?.code || '', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
    status: [entity?.status || 'active', [Validators.required]],

    // Complex entities - add based on schema fields
    // For headquarters: address, contact_info
    // For workshops: start_datetime, end_datetime, location_details
    // For agreements: email, phone, document_number, etc.
  });
}
```

#### ✅ **5.2 Form Template Structure**

```html
<div class="{feature}-form">
  <div class="form-header">
    <tui-icon [icon]="isEditMode() ? '@tui.pencil' : '@tui.plus'" class="form-icon"></tui-icon>
    <h3 class="heading">{{ isEditMode() ? ('edit_{feature}' | translate) : ('create_{feature}' | translate) }}</h3>
  </div>

  <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-content">
    <!-- Standard fields -->
    <div class="form-field">
      <label class="field-label" for="{feature}-name">
        <tui-icon icon="@tui.user" class="field-icon"></tui-icon>
        {{ 'name' | translate }}
      </label>
      <tui-textfield tuiAutoFocus tuiTextfieldSize="m" class="form-input">
        <input tuiTextfield formControlName="name" [placeholder]="'enter_name' | translate" />
      </tui-textfield>
      <tui-error formControlName="name" [error]="[] | tuiFieldError | async"></tui-error>
    </div>

    <!-- Add fields based on schema analysis -->
    <!-- For simple entities: code, status -->
    <!-- For complex entities: custom fields with appropriate input types -->
    <!-- JSON fields: Custom components or textareas -->
    <!-- Date fields: Date pickers -->
    <!-- Foreign keys: Dropdowns with related entity options -->

    <!-- Status select (if status field exists) -->
    <div class="form-field" *ngIf="hasStatusField">
      <label class="field-label">
        <tui-icon icon="@tui.power" class="field-icon"></tui-icon>
        {{ 'status' | translate }}
      </label>
      <tui-textfield tuiChevron tuiTextfieldSize="m" class="form-input">
        <input tuiSelect formControlName="status" [placeholder]="'select_status' | translate" />
        <tui-data-list-wrapper *tuiTextfieldDropdown [items]="statusOptions" />
      </tui-textfield>
      <tui-error formControlName="status" [error]="[] | tuiFieldError | async"></tui-error>
    </div>
  </form>
</div>
```

---

### **Phase 6: Schema-Specific Adaptations**

#### ✅ **6.1 Simple Entities** (Countries, Roles)

```typescript
// Minimal form fields
interface SimpleEntityFormData {
  name: string;
  code: string;
  status: 'active' | 'inactive';
}

// Standard table columns
tableColumns = [
  { key: 'name', type: 'avatar' },
  { key: 'code', type: 'badge' },
  { key: 'status', type: 'status' },
  { key: 'actions', type: 'actions' },
];

// Disable pagination for small datasets
enablePagination = false;
pageSize = 10;
```

#### ✅ **6.2 Complex Entities** (Headquarters, Events)

```typescript
// Rich form data
interface ComplexEntityFormData {
  name: string;
  address?: string;
  contact_info?: any; // JSON field
  country_id?: string; // Foreign key
  status: string;
}

// Extended table columns
tableColumns = [
  { key: 'name', type: 'avatar' },
  { key: 'address', type: 'text' },
  { key: 'country', type: 'text' }, // Show related entity name
  { key: 'status', type: 'status' },
  { key: 'actions', type: 'actions' }
];

// Handle JSON fields in forms
buildForm() {
  return this.fb.group({
    name: ['', Validators.required],
    address: [''],
    contact_info: this.fb.group({
      phone: [''],
      email: ['', Validators.email],
      website: ['']
    }),
    country_id: [''],
    status: ['active']
  });
}
```

#### ✅ **6.3 High-Volume Entities** (Agreements, Attendance)

```typescript
// Use specialized pagination functions
entities = resource({
  request: () => ({
    page: this.currentPage(),
    pageSize: this.pageSize(),
    search: this.searchTerm(),
    filters: this.activeFilters(),
  }),
  loader: async ({ request }) => {
    // Use database function for efficient pagination
    const { data, error } = await this.supabase.getClient().rpc('get_agreements_with_role_paginated', {
      p_limit: request.pageSize,
      p_offset: request.page * request.pageSize,
      p_search: request.search,
      // Add filter parameters
    });

    if (error) throw error;
    return data;
  },
});

// Higher page sizes for efficiency
pageSize = 50;
enableAdvancedFiltering = true;

// Include search across multiple fields
searchableColumns = ['name', 'email', 'document_number', 'phone'];
```

---

### **Phase 7: Translation & Routing**

#### ✅ **7.1 Translation Keys Pattern**

```json
{
  // Feature navigation
  "{features}": "Features",
  "{feature}": "Feature",
  "{features}_description": "Manage {features} and their information",

  // CRUD operations
  "create_{feature}": "Create {Feature}",
  "edit_{feature}": "Edit {Feature}",
  "delete_{feature}": "Delete {Feature}",
  "update_{feature}": "Update {Feature}",

  // States and messages
  "no_{features}_found": "No {features} found",
  "no_{features}_description": "Start by creating your first {feature}",
  "total_{features}": "Total {Features}",
  "active_{features}": "Active {Features}",
  "inactive_{features}": "Inactive {Features}",

  // Form fields (adapt based on schema)
  "{feature}_name": "{Feature} Name",
  "enter_{feature}_name": "Enter {feature} name",
  "{feature}_code": "{Feature} Code",
  "enter_{feature}_code": "Enter code",

  // Notifications
  "{feature}_created_success": "{Feature} '{{name}}' has been created successfully",
  "{feature}_updated_success": "{Feature} '{{name}}' has been updated successfully",
  "{feature}_deleted_success": "{Feature} '{{name}}' has been deleted successfully",
  "{feature}_create_error": "Failed to create {feature}. Please try again.",
  "{feature}_update_error": "Failed to update {feature}. Please try again.",
  "{feature}_delete_error": "Failed to delete {feature}. Please try again."
}
```

#### ✅ **7.2 Route Configuration**

```typescript
// libs/zambia/feat-{features}/src/lib/feat-{features}.routes.ts
export const {FEATURES}_ROUTES: Route[] = [
  {
    path: '',
    component: {Features}ListSmartComponent,
    title: '{Features} | Zambia'
  },
  {
    path: ':id',
    component: {Feature}DetailSmartComponent,
    title: '{Feature} Detail | Zambia'
  },
];
```

---

### **Phase 8: Testing & Quality Checklist**

#### ✅ **8.1 Functionality Testing**

- [ ] **CRUD Operations**: Create, read, update, delete all work correctly
- [ ] **Validation**: Form validation displays appropriate error messages
- [ ] **Loading States**: All async operations show loading indicators
- [ ] **Error Handling**: Network errors and validation errors handled gracefully
- [ ] **Search & Filter**: Table search works across designated columns
- [ ] **Pagination**: Works correctly for high-volume features
- [ ] **Export**: CSV/Excel export includes all visible data

#### ✅ **8.2 UX/UI Testing**

- [ ] **Responsive Design**: Works on mobile, tablet, desktop
- [ ] **Dark Mode**: All components support theme switching
- [ ] **Loading Skeletons**: Smooth loading experience
- [ ] **Empty States**: Helpful empty state messages
- [ ] **Breadcrumb Navigation**: Consistent navigation experience
- [ ] **Role-Based Access**: Features hidden/shown based on user permissions

#### ✅ **8.3 Performance Testing**

- [ ] **Large Dataset Handling**: Table performs well with expected data volume
- [ ] **Search Performance**: Search/filter operations are responsive
- [ ] **Memory Management**: No memory leaks in signal subscriptions
- [ ] **Bundle Size**: Feature module doesn't significantly increase bundle size

---

## 🎯 **QUICK FEATURE ASSESSMENT GUIDE**

### **Before Starting, Ask:**

1. **Data Volume**: How many records will this feature typically have?

   - `< 100`: Simple list, no pagination
   - `100-1000`: Standard pagination
   - `1000+`: Check for specialized database functions

2. **Field Complexity**: What types of fields does the entity have?

   - Simple: `name`, `code`, `status` → Standard form modal
   - Medium: + `address`, `contact_info` → Larger form with sections
   - Complex: + JSON fields, multiple relations → Consider multi-step or tabbed interface

3. **Relationships**: Does this entity have related data to display?

   - None: Detail view shows entity info only
   - Few: Include related data in detail view table
   - Many: Consider tabbed detail view or separate pages

4. **Business Logic**: Are there special rules or workflows?
   - Standard CRUD: Use template as-is
   - Special workflows: Add custom handlers and validation
   - Complex permissions: Implement role-based feature visibility

### **Feature-Specific Examples:**

**Headquarters** (Medium Complexity):

- Fields: `name`, `address`, `contact_info (JSON)`, `country_id (FK)`
- Relations: Country (parent), Seasons/Workshops (children)
- Volume: Medium (10-100 per country)
- UI: Standard form with address fields, country dropdown

**Workshops** (Complex):

- Fields: `local_name`, `start_datetime`, `end_datetime`, `facilitator_id (FK)`, `location_details`
- Relations: Facilitator, Headquarters, Season, Workshop Type, Attendance records
- Volume: High (100s per season)
- UI: Date/time pickers, user selection dropdowns, location details

**Agreements** (High Volume + Complex):

- Fields: 20+ including personal data, verification flags, JSON fields
- Relations: Role, Headquarters, Season, User
- Volume: Very High (1000s) - requires pagination function
- UI: Multi-section form, specialized filtering, bulk operations

This guide ensures you replicate the exact same professional quality, comprehensive functionality, and excellent user experience across all your features while adapting to each feature's specific requirements!
