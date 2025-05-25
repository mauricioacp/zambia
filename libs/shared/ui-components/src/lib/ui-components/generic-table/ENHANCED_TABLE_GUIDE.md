# Enhanced Table Component Guide

The Enhanced Table component (`z-enhanced-table`) is a modern, reusable table component that combines the beautiful TaigaUI design with powerful features for displaying and managing data.

## Features

- 🎨 **Modern TaigaUI Design** - Beautiful, consistent styling with proper theming support
- 👤 **Avatar Columns** - Auto-generated avatars with colors for user-friendly display
- 🏷️ **Badge Columns** - Styled badges for codes, tags, and short values
- 📊 **Status Indicators** - Color-coded status with icons
- ⚡ **Action Buttons** - Flexible action configuration with routing and handlers
- 🎭 **Custom Templates** - Support for custom column templates
- 📱 **Responsive Design** - Works on all screen sizes
- 🌓 **Theme Support** - Light/dark mode compatibility
- 🔄 **Loading States** - Built-in loading and empty state handling

## Basic Usage

```typescript
@Component({
  template: `
    <z-enhanced-table
      [items]="data()"
      [columns]="tableColumns()"
      [actions]="tableActions()"
      [loading]="isLoading()"
      [title]="'My Data'"
      [showCreateButton]="true"
      [createButtonLabel]="'Add New'"
      (createClick)="onCreateNew()"
      (rowClick)="onRowClick($event)"
    />
  `,
})
export class MyComponent {
  data = signal<MyData[]>([]);
  isLoading = signal(false);

  tableColumns = computed((): TableColumn[] => [
    {
      key: 'name',
      label: 'Name',
      type: 'avatar', // Shows avatar with name
      sortable: true,
      searchable: true,
    },
    {
      key: 'code',
      label: 'Code',
      type: 'badge', // Shows as a styled badge
    },
    {
      key: 'status',
      label: 'Status',
      type: 'status', // Color-coded with icons
    },
    {
      key: 'actions',
      label: 'Actions',
      type: 'actions', // Action buttons
      align: 'center',
    },
  ]);

  tableActions = computed((): TableAction<MyData>[] => [
    {
      label: 'View',
      icon: '@tui.eye',
      color: 'primary',
      routerLink: (item) => ['/view', item.id],
    },
    {
      label: 'Edit',
      icon: '@tui.pencil',
      color: 'warning',
      handler: (item) => this.onEdit(item),
    },
    {
      label: 'Delete',
      icon: '@tui.trash',
      color: 'danger',
      handler: (item) => this.onDelete(item),
      disabled: (item) => item.status === 'protected',
    },
  ]);
}
```

## Column Types

### Avatar Column

```typescript
{
  key: 'name',
  label: 'User',
  type: 'avatar',
  // Automatically generates colored avatars with initials
  // Shows subtitle with additional info if available
}
```

### Badge Column

```typescript
{
  key: 'code',
  label: 'Code',
  type: 'badge',
  // Displays value in a styled badge (good for codes, tags)
}
```

### Status Column

```typescript
{
  key: 'status',
  label: 'Status',
  type: 'status',
  // Shows color-coded status with appropriate icons
  // Supports 'active'/'inactive' by default
}
```

### Actions Column

```typescript
{
  key: 'actions',
  label: 'Actions',
  type: 'actions',
  align: 'center',
  // Renders action buttons defined in the actions array
}
```

### Custom Column

```typescript
{
  key: 'custom',
  label: 'Custom',
  type: 'custom',
  // Uses custom template if provided, otherwise falls back to text
}
```

## Action Configuration

```typescript
const actions: TableAction<T>[] = [
  {
    label: 'View',
    icon: '@tui.eye',
    color: 'primary', // 'primary' | 'secondary' | 'warning' | 'danger'
    routerLink: (item) => ['/view', item.id], // For navigation
  },
  {
    label: 'Edit',
    icon: '@tui.pencil',
    color: 'warning',
    handler: (item) => console.log('Edit', item), // For custom actions
    disabled: (item) => item.readonly, // Conditional disabling
  },
  {
    label: 'Delete',
    icon: '@tui.trash',
    color: 'danger',
    handler: (item) => this.delete(item),
    visible: (item) => item.canDelete, // Conditional visibility
  },
];
```

## Custom Templates

For complex column content, use custom templates:

```html
<z-enhanced-table [items]="data()" [columns]="columns()">
  <ng-template zColumnTemplate="customField" let-item>
    <div class="custom-content">
      <tui-icon [icon]="getIcon(item)"></tui-icon>
      <span>{{ formatValue(item.customField) }}</span>
    </div>
  </ng-template>
</z-enhanced-table>
```

## Configuration Options

### Basic Configuration

- `items` - Array of data objects to display
- `columns` - Column configuration array
- `actions` - Action buttons configuration
- `loading` - Loading state boolean
- `trackBy` - Property name for tracking (default: 'id')

### Display Configuration

- `title` - Table title
- `description` - Description text below title
- `showCreateButton` - Show create button in header
- `createButtonLabel` - Create button text
- `createButtonIcon` - Create button icon

### Empty/Loading States

- `emptyStateTitle` - Title for empty state
- `emptyStateDescription` - Description for empty state
- `emptyStateIcon` - Icon for empty state
- `loadingText` - Loading state text

### Events

- `createClick` - Fired when create button is clicked
- `rowClick` - Fired when a row is clicked

## Styling

The component uses TaigaUI design tokens and follows the established style guide:

- Proper light/dark theme support
- Consistent spacing and typography
- Accessible focus states
- Responsive design

## Migration from Generic Table

To migrate from the old generic table:

1. Replace `z-generic-table` with `z-enhanced-table`
2. Convert your headers array to column configuration objects
3. Convert action templates to action configuration
4. Update imports to include the new types

Example migration:

```typescript
// Old way
headers = ['name', 'code', 'status', 'actions'];
headerLabels = { name: 'Name', code: 'Code', status: 'Status', actions: 'Actions' };

// New way
columns = computed((): TableColumn[] => [
  { key: 'name', label: 'Name', type: 'avatar' },
  { key: 'code', label: 'Code', type: 'badge' },
  { key: 'status', label: 'Status', type: 'status' },
  { key: 'actions', label: 'Actions', type: 'actions' },
]);
```

## Best Practices

1. **Use appropriate column types** for better UX
2. **Configure actions declaratively** instead of templates when possible
3. **Provide meaningful labels** and descriptions
4. **Handle loading and empty states** properly
5. **Use computed signals** for reactive configuration
6. **Follow the style guide** for consistent appearance

## Example: Countries Table

```typescript
// Complete example from the countries feature
tableColumns = computed((): TableColumn[] => [
  {
    key: 'name',
    label: this.translate.instant('name'),
    type: 'avatar',
    sortable: true,
    searchable: true,
  },
  {
    key: 'code',
    label: this.translate.instant('code'),
    type: 'badge',
    sortable: true,
    searchable: true,
  },
  {
    key: 'status',
    label: this.translate.instant('status'),
    type: 'status',
    sortable: true,
  },
  {
    key: 'actions',
    label: this.translate.instant('actions'),
    type: 'actions',
    align: 'center',
  },
]);

tableActions = computed((): TableAction<Country>[] => [
  {
    label: this.translate.instant('view'),
    icon: '@tui.eye',
    color: 'primary',
    routerLink: (country: Country) => ['/dashboard/countries', country.id],
  },
  {
    label: this.translate.instant('edit'),
    icon: '@tui.pencil',
    color: 'warning',
    handler: (country: Country) => this.onEditCountry(country),
    disabled: () => this.isProcessing(),
  },
  {
    label: this.translate.instant('delete'),
    icon: '@tui.trash',
    color: 'danger',
    handler: (country: Country) => this.onDeleteCountry(country),
    disabled: () => this.isProcessing(),
  },
]);
```

This approach provides a clean, declarative way to configure tables while maintaining all the visual appeal and functionality of the modern design.
