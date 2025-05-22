# Generic Table Component

A comprehensive, highly configurable table component built with Angular and Taiga UI that provides advanced features like search, pagination, column management, and theming support.

## Component Overview

The `GenericTableUiComponent` is a reusable table component that automatically adapts to your data structure while providing extensive customization options. It integrates seamlessly with the Zambia style guide and supports both light and dark themes.

## Quick Start

```typescript
// Basic usage
<z-generic-table
  [items]="data"
  [headers]="['name', 'email', 'status']"
  [headerLabels]="{ name: 'Full Name', email: 'Email Address', status: 'Status' }"
/>

// Advanced usage with all features enabled
<z-generic-table
  [items]="headquarters"
  [headers]="['name', 'countries', 'status', 'created_at']"
  [headerLabels]="headerLabels"
  [enablePagination]="true"
  [enableFiltering]="true"
  [enableColumnVisibility]="true"
  [showTableControls]="true"
  [searchableColumns]="['name', 'countries']"
  [searchTransformers]="searchTransformers"
  (rowClick)="onRowClick($event)"
>
  <!-- Custom column templates -->
  <ng-template columnTemplate="status" let-item>
    <custom-status-badge [status]="item.status" />
  </ng-template>
</z-generic-table>
```

## Core Features

### 🔍 Advanced Search

- **Debounced search** with 300ms delay for optimal performance
- **Multi-column search** with configurable searchable columns
- **Custom search transformers** for complex object filtering
- **Smart object handling** for nested data structures (e.g., country objects)
- **TUI_DEFAULT_MATCHER** integration for accent-insensitive search

### 📊 Flexible Data Display

- **Automatic column detection** from data structure
- **Custom column templates** via content projection
- **Built-in status badge rendering** with style guide colors
- **Configurable column widths** and text wrapping
- **Smart cell value formatting** (numbers, booleans, null handling)

### 🎛️ Table Controls

- **Column visibility management** with dropdown interface
- **Interactive search bar** with visual feedback
- **Sortable columns** with Taiga UI integration
- **Pagination** with customizable page sizes
- **Row selection** with multi-select support

### 🎨 Theme Integration

- **Zambia style guide compliance** with exact color mappings
- **Automatic light/dark theme switching** via CSS custom properties
- **Taiga UI variable overrides** for seamless integration
- **Consistent shadows and borders** matching design system

## Input Properties

### Data Configuration

```typescript
items = input<T[]>([]); // Array of data objects
headers = input<string[]>([]); // Column keys to display
headerLabels = input<Record<string, string>>({}); // Display labels for headers
emptyMessage = input<string>('No data available'); // Empty state message
trackBy = input<string>('id'); // Property for change tracking
```

### Feature Toggles

```typescript
enablePagination = input<boolean>(true);
enableSorting = input<boolean>(true);
enableFiltering = input<boolean>(true);
enableColumnVisibility = input<boolean>(true);
enableRowSelection = input<boolean>(false);
showTableControls = input<boolean>(false); // Shows search and column controls
```

### Display Options

```typescript
tableSize = input<'s' | 'm' | 'l'>('m'); // Taiga UI table size
loading = input<boolean>(false); // Shows skeleton loader
```

### Pagination

```typescript
pageSize = input<number>(10);
pageSizeOptions = input<number[]>([5, 10, 20, 50, 100]);
```

### Search Configuration

```typescript
searchDebounceTime = input<number>(300);
searchableColumns = input<string[]>([]); // Specific columns to search
searchTransformers = input<Record<string, (value: any) => string>>({}); // Custom search logic
```

### Layout Customization

```typescript
sortableColumns = input<string[]>([]); // Columns that can be sorted
columnWidths = input<Record<string, number>>({}); // Min-width for columns
textColumns = input<string[]>(['description', 'notes', 'comment']); // Text-wrap columns
```

## Output Events

```typescript
itemsSelectionChange = output<T[]>(); // Row selection changes
sortChange = output<TuiSortChange<T>>(); // Column sort changes
paginationChange = output<TuiTablePaginationEvent>(); // Pagination changes
rowClick = output<T>(); // Row click events
```

## Advanced Usage Examples

### Custom Search Transformers

```typescript
// For complex object searching (e.g., country objects)
searchTransformers = {
  countries: (value: any) => {
    if (value && value.name && value.code) {
      return `${value.name} (${value.code}) ${value.name} ${value.code}`;
    }
    return value?.name || value?.code || '';
  },
};
```

### Custom Column Templates

```typescript
// In your component template
<z-generic-table [items]="items">
  <!-- Custom status column -->
  <ng-template columnTemplate="status" let-item>
    <div class="flex items-center gap-2">
      <div [class]="getStatusIndicator(item.status)"></div>
      <span>{{ getStatusLabel(item.status) }}</span>
    </div>
  </ng-template>

  <!-- Custom action column -->
  <ng-template columnTemplate="actions" let-item>
    <div class="flex gap-2">
      <button (click)="edit(item)" class="btn-sm">Edit</button>
      <button (click)="delete(item)" class="btn-sm">Delete</button>
    </div>
  </ng-template>
</z-generic-table>
```

### Complete Configuration Example

```typescript
@Component({
  template: `
    <z-generic-table
      [items]="headquarters"
      [headers]="tableHeaders"
      [headerLabels]="headerLabels"
      [searchableColumns]="['name', 'countries']"
      [searchTransformers]="searchTransformers"
      [sortableColumns]="['name', 'created_at']"
      [columnWidths]="{ name: 200, countries: 150 }"
      [enablePagination]="true"
      [enableFiltering]="true"
      [enableColumnVisibility]="true"
      [showTableControls]="true"
      [pageSize]="20"
      [loading]="loading"
      (rowClick)="navigateToDetail($event)"
      (paginationChange)="onPaginationChange($event)"
    >
      <ng-template columnTemplate="countries" let-item>
        <div class="flex items-center gap-2">
          <img [src]="item.countries.flag" class="h-3 w-5" />
          <span>{{ item.countries.name }}</span>
        </div>
      </ng-template>
    </z-generic-table>
  `,
})
export class ExampleComponent {
  tableHeaders = ['name', 'countries', 'status', 'created_at'];

  headerLabels = {
    name: 'Headquarter Name',
    countries: 'Country',
    status: 'Status',
    created_at: 'Created Date',
  };

  searchTransformers = {
    countries: (value: any) => {
      if (value && value.name && value.code) {
        return `${value.name} (${value.code})`;
      }
      return value?.name || '';
    },
  };
}
```

## Styling and Theming

### CSS Architecture

The component uses a hybrid approach combining:

- **Taiga UI variable overrides** for automatic theme integration
- **Style guide color mappings** for brand consistency
- **Component-specific classes** prefixed with `z-` for isolation

### Key CSS Classes

```less
.z-table-container      // Main container with shadows and borders
.z-table-controls       // Search and column controls section
.z-table               // Main table element
.z-status-badge        // Status indicators with dot + text
.z-pagination          // Bottom pagination area
.z-empty-state         // No data state
.z-dropdown            // Column visibility dropdown;
```

### Color System Integration

The component automatically inherits your style guide colors through Taiga UI variable overrides:

```less
:host {
  // Light theme colors (from style guide)
  --tui-background-base: #ffffff; // bg-white
  --tui-text-primary: rgb(31 41 55); // text-gray-800
  --tui-background-accent-1: rgb(59 130 246); // bg-blue-500

  // Dark theme colors
  :global(.dark) & {
    --tui-background-base: rgb(30 41 59); // dark:bg-slate-800
    --tui-text-primary: #ffffff; // dark:text-white
  }
}
```

## Performance Considerations

### Optimizations

- **OnPush change detection** for optimal performance
- **Debounced search** to prevent excessive filtering
- **Computed signals** for reactive data transformations
- **Efficient tracking** with configurable `trackBy` property
- **Lazy rendering** with Taiga UI table virtualization

### Memory Management

- **RxJS interop** with proper cleanup
- **Signal-based state** for automatic subscription management
- **Content projection** for flexible templating without performance overhead

## Accessibility Features

- **Semantic HTML** with proper table structure
- **ARIA labels** on interactive elements
- **Keyboard navigation** support via Taiga UI
- **Focus management** with visible focus indicators
- **Screen reader friendly** with proper labeling

## Browser Support

Compatible with all modern browsers supporting:

- ES2020+
- CSS Custom Properties
- Angular 19+
- Taiga UI requirements

## Troubleshooting

### Common Issues

1. **Search not working on complex objects**

   - Use `searchTransformers` to define custom search logic
   - Ensure `searchableColumns` includes the correct property names

2. **Columns not displaying correctly**

   - Check that `headers` array matches your data object keys
   - Verify `headerLabels` mapping for display names

3. **Theming issues**

   - Ensure your app has the `.dark` class properly configured
   - Check that Taiga UI styles are loaded correctly

4. **Performance with large datasets**
   - Enable pagination with reasonable page sizes
   - Consider server-side filtering for very large datasets
   - Use `trackBy` with unique, stable identifiers

### Debug Tips

```typescript
// Enable debug logging
console.log('Available columns:', this.allAvailableColumns());
console.log('Filtered items:', this.filteredItems());
console.log('Search term:', this.searchTerm());
```

## Related Components

- `ColumnTemplateDirective` - For custom column templates
- Taiga UI Table components - Core table functionality
- Style Guide components - Consistent UI patterns

This component is part of the Zambia UI library and follows all established patterns for consistency and maintainability.
