# Enhanced Table Pagination Guide

## Overview

The Enhanced Table component now includes modern pagination with customizable page sizes, following Taiga UI's latest patterns. This guide covers both **client-side pagination** (current implementation) and **server-side pagination** (future API integration).

## Basic Usage

### Client-Side Pagination (Current Implementation)

```typescript
// Component Template
<z-enhanced-table
  [items]="countries"
  [columns]="tableColumns"
  [loading]="isLoading"
  [enablePagination]="true"
  [pageSize]="10"
  [pageSizeOptions]="[10, 25, 50, 100]"
  (paginationChange)="onPaginationChange($event)"
/>

// Component Logic
export class CountriesListComponent {
  countries = signal<Country[]>([]);

  tableColumns: TableColumn[] = [
    { key: 'name', label: 'Country Name', sortable: true },
    { key: 'code', label: 'Code', sortable: true },
    { key: 'status', label: 'Status', type: 'status' }
  ];

  onPaginationChange(event: TuiTablePaginationEvent) {
    console.log('Page changed:', event.page);
    console.log('Page size changed:', event.size);
    console.log('Total items:', event.total);
  }
}
```

### Pagination Configuration Options

| Input              | Type       | Default             | Description                          |
| ------------------ | ---------- | ------------------- | ------------------------------------ |
| `enablePagination` | `boolean`  | `true`              | Enable/disable pagination completely |
| `pageSize`         | `number`   | `10`                | Initial number of items per page     |
| `pageSizeOptions`  | `number[]` | `[10, 25, 50, 100]` | Available page size options          |

### Pagination Events

```typescript
interface TuiTablePaginationEvent {
  page: number; // Current page index (0-based)
  size: number; // Current page size
  total: number; // Total number of items
}
```

## Advanced Usage

### Disable Pagination

```typescript
<z-enhanced-table
  [items]="items"
  [columns]="columns"
  [enablePagination]="false"
/>
```

### Custom Page Sizes

```typescript
<z-enhanced-table
  [items]="items"
  [columns]="columns"
  [pageSize]="25"
  [pageSizeOptions]="[5, 10, 25, 50, 100, 250]"
/>
```

## Server-Side Pagination (Future Implementation)

### Recommended API Response Structure

```typescript
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;           // Current page (0-based)
    pageSize: number;       // Items per page
    totalItems: number;     // Total items across all pages
    totalPages: number;     // Total number of pages
    hasNext: boolean;       // Whether there's a next page
    hasPrev: boolean;       // Whether there's a previous page
  }
}

// Example API Response
{
  "data": [
    { "id": 1, "name": "Argentina", "code": "AR", "status": "active" },
    { "id": 2, "name": "Brazil", "code": "BR", "status": "active" }
  ],
  "pagination": {
    "page": 0,
    "pageSize": 10,
    "totalItems": 156,
    "totalPages": 16,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Server-Side Implementation Example

```typescript
// Service
@Injectable()
export class CountriesService {
  getCountries(page: number, pageSize: number, search?: string): Observable<PaginatedResponse<Country>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('search', search || '');

    return this.http.get<PaginatedResponse<Country>>('/api/countries', { params });
  }
}

// Component
export class CountriesListComponent {
  countries = signal<Country[]>([]);
  totalItems = signal(0);
  currentPage = signal(0);
  currentPageSize = signal(10);
  loading = signal(false);

  constructor(private countriesService: CountriesService) {
    this.loadCountries();
  }

  loadCountries() {
    this.loading.set(true);

    this.countriesService.getCountries(this.currentPage(), this.currentPageSize(), this.searchTerm()).subscribe({
      next: (response) => {
        this.countries.set(response.data);
        this.totalItems.set(response.pagination.totalItems);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load countries:', error);
        this.loading.set(false);
      },
    });
  }

  onPaginationChange(event: TuiTablePaginationEvent) {
    // Update current state
    this.currentPage.set(event.page);
    this.currentPageSize.set(event.size);

    // Reload data from server
    this.loadCountries();
  }

  onSearchChange(searchTerm: string) {
    this.searchTerm.set(searchTerm);
    this.currentPage.set(0); // Reset to first page on search
    this.loadCountries();
  }
}
```

### Server-Side Template

```typescript
<!-- For server-side pagination, override items and totalItems -->
<z-enhanced-table
  [items]="countries()"
  [columns]="tableColumns"
  [loading]="loading()"
  [enablePagination]="true"
  [pageSize]="currentPageSize()"
  [pageSizeOptions]="[10, 25, 50, 100]"
  [totalItems]="totalItems()"  <!-- Override total for server-side -->
  (paginationChange)="onPaginationChange($event)"
  (searchChange)="onSearchChange($event)"
/>
```

## Pagination Features

### 🔧 **Enhanced Features:**

1. **Modern UI**: Uses Taiga UI's latest pagination components
2. **Page Size Selector**: Dropdown to change items per page
3. **Smart Labels**: Shows "X-Y of Z rows" with proper translations
4. **Optional**: Can be completely disabled
5. **Responsive**: Works well on mobile and desktop
6. **Accessible**: Proper ARIA labels and keyboard navigation

### 🎨 **Visual Components:**

- **Total Count**: "156 rows" display
- **Range Display**: "1-10 rows" button with dropdown
- **Page Size Options**: Configurable options (10, 25, 50, 100)
- **Navigation**: Previous/Next buttons with page numbers

### 🌐 **Internationalization:**

All pagination text is fully translated:

- English: "rows", "items per page"
- Spanish: "filas", "elementos por página"

## Migration Guide

### From Current TuiTablePagination

**Before:**

```html
<tui-table-pagination
  [total]="totalItems"
  [page]="currentPage"
  [size]="pageSize"
  [items]="pageSizeOptions"
  (paginationChange)="onPaginationChange($event)"
/>
```

**After:**

```html
<z-enhanced-table
  [items]="items"
  [columns]="columns"
  [enablePagination]="true"
  [pageSize]="10"
  [pageSizeOptions]="[10, 25, 50, 100]"
  (paginationChange)="onPaginationChange($event)"
/>
```

The new pagination system provides a better user experience with modern UI patterns and prepares your application for seamless server-side pagination integration.
