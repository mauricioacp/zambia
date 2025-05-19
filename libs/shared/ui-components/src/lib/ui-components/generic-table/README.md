# Generic Table Component

A flexible, reusable table component that can display any type of object array.

## Features

- Uses Angular's input signals for better performance and reactivity
- Strongly typed with TypeScript generics for type safety
- Accepts any array of objects as input
- Automatically generates table headers from object properties if not provided
- Shows a customizable empty message when the array is empty
- Uses Angular's `@for` syntax with `@empty` block
- Supports custom tracking for better performance
- Responsive design with Tailwind CSS
- Dark mode support
- OnPush change detection for optimal performance

## Usage

### Basic Usage

```typescript
import { Component, signal } from '@angular/core';
import { GenericTableUiComponent } from '@zambia/ui-components';

// Define your item type for better type safety
interface MyItem {
  id: string;
  name: string;
  status: string;
}

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [GenericTableUiComponent],
  template: ` <zambia-generic-table [items]="myItems()"></zambia-generic-table> `,
})
export class MyComponent {
  // Use a signal for reactive updates
  myItems = signal<MyItem[]>([
    { id: '1', name: 'Item 1', status: 'Active' },
    { id: '2', name: 'Item 2', status: 'Inactive' },
  ]);
}
```

### With Custom Headers

```typescript
import { Component, signal } from '@angular/core';
import { GenericTableUiComponent } from '@zambia/ui-components';

interface MyItem {
  id: string;
  name: string;
  status: string;
}

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [GenericTableUiComponent],
  template: ` <zambia-generic-table [items]="myItems()" [headers]="headers()"></zambia-generic-table> `,
})
export class MyComponent {
  myItems = signal<MyItem[]>([
    { id: '1', name: 'Item 1', status: 'Active' },
    { id: '2', name: 'Item 2', status: 'Inactive' },
  ]);

  headers = signal<string[]>(['name', 'status']);
}
```

### With Custom Empty Message

```typescript
import { Component, signal } from '@angular/core';
import { GenericTableUiComponent } from '@zambia/ui-components';

interface MyItem {
  id: string;
  name: string;
}

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [GenericTableUiComponent],
  template: ` <zambia-generic-table [items]="myItems()" [emptyMessage]="emptyMessage()"></zambia-generic-table> `,
})
export class MyComponent {
  myItems = signal<MyItem[]>([]);
  emptyMessage = signal<string>('No items found. Please try again later.');
}
```

### With Custom Tracking

```typescript
import { Component, signal } from '@angular/core';
import { GenericTableUiComponent } from '@zambia/ui-components';

interface CustomItem {
  customId: string;
  name: string;
}

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [GenericTableUiComponent],
  template: ` <zambia-generic-table [items]="myItems()" [trackBy]="trackByField()"></zambia-generic-table> `,
})
export class MyComponent {
  myItems = signal<CustomItem[]>([
    { customId: 'a1', name: 'Item 1' },
    { customId: 'a2', name: 'Item 2' },
  ]);

  trackByField = signal<string>('customId');
}
```

## Inputs

| Input        | Type              | Default               | Description                                                                                                          |
| ------------ | ----------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------- |
| items        | `input<T[]>`      | `[]`                  | Signal with array of objects to display in the table                                                                 |
| headers      | `input<string[]>` | `[]`                  | Signal with array of property names to display as columns. If empty, all properties from the first item will be used |
| emptyMessage | `input<string>`   | `'No data available'` | Signal with message to display when the items array is empty                                                         |
| trackBy      | `input<string>`   | `'id'`                | Signal with property name to use for tracking items in the @for loop                                                 |

## Example with Agreement Type

```typescript
import { Component, inject, signal } from '@angular/core';
import { GenericTableUiComponent } from '@zambia/ui-components';
import { Agreement, AgreementsFacadeService } from '@zambia/feat-agreements';

@Component({
  selector: 'app-agreements-table',
  standalone: true,
  imports: [GenericTableUiComponent],
  template: `
    <zambia-generic-table<Agreement> 
      [items]="agreements()"
      [headers]="headers()"
      [emptyMessage]="emptyMessage()"
    ></zambia-generic-table>
  `,
})
export class AgreementsTableComponent {
  private agreementsFacade = inject(AgreementsFacadeService);

  // Use signals for reactive updates
  agreements = signal<Agreement[]>([]);
  headers = signal<string[]>(['name', 'email', 'status', 'created_at']);
  emptyMessage = signal<string>('No agreements found');

  constructor() {
    // Subscribe to agreements data
    this.agreementsFacade.agreements.subscribe((data) => {
      if (data) {
        this.agreements.set(data);
      }
    });
  }
}
```
