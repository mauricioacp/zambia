# Angular Development Guidelines

This document provides comprehensive Angular development guidelines for the Zambia project.

## Modern Angular Practices

This project uses Angular v19 with modern patterns and syntax. Always follow these guidelines:

### Template Syntax

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

### Component Architecture

- **Use OnPush change detection strategy** for all components
- **Use standalone components** exclusively (no NgModules)
- **Use signals** for reactive state management
- **Use computed signals** for derived state
- **Use effect()** for side effects, sparingly

### Signals and Reactivity

- **Prefer signals to observables** for local component state
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

### Content Projection

- **Use ng-content** with select attributes for multiple slots
- **Use ng-template** for conditional content projection
- **Provide fallback content** when appropriate

### Component Lifecycle

- **Use lifecycle hooks judiciously** with OnPush strategy
- **Prefer signals and computed values** over lifecycle hooks for reactive updates
- **Use afterNextRender()** for DOM manipulations
- **Use afterRender()** for cleanup that needs to happen after every render

## Code Style Guidelines

- **Use consistent naming conventions** following the style guide
- **Write descriptive component and method names**
- **Keep components focused and single-purpose**
- **Extract complex logic into services**
- **Use TypeScript strict mode features**
- **Leverage type inference** where possible

## Testing Patterns

- **Test component behavior**, not implementation details
- **Use component harnesses** for complex component testing
- **Mock external dependencies** properly
- **Write integration tests** for critical user flows

## Template Best Practices

### Data Binding

#### Text Interpolation and Property Binding

- **Use interpolation `{{ }}` for dynamic text** - values are automatically converted to strings
- **Use property binding `[property]="expression"`** for DOM properties, component inputs, and directive properties
- **Use attribute binding `[attr.attributeName]="value"`** for HTML attributes
- **Use class binding `[class.className]="condition"`** for conditional CSS classes
- **Use style binding `[style.property]="value"`** or `[style.property.unit]="value"` for dynamic styles
- **Create new object/array instances** to trigger change detection when needed

#### Event Handling

- **Use event binding `(eventName)="handler()"`** syntax consistently
- **Access native events with `$event`** parameter when needed
- **Use key modifiers** like `(keyup.enter)="handler()"` for keyboard interactions
- **Call `preventDefault()` explicitly** instead of returning `false`
- **Use descriptive method names** that indicate the action being performed

#### Two-Way Binding

- **Prefer reactive forms** with `[formControl]`, `[formGroup]`, and `formControlName` directives
- **Use `FormBuilder` service** for cleaner reactive form code
- **Use `patchValue()` for partial updates**, `setValue()` for complete replacements
- **Use `[(ngModel)]` sparingly** - only for simple template-driven forms

### Template Structure

#### Content Projection

- **Use `ng-content` with select attributes** for multi-slot projection:
  ```html
  <ng-content select="header"></ng-content>
  <ng-content select=".content"></ng-content>
  <ng-content></ng-content>
  <!-- Default slot -->
  ```
- **Provide fallback content** inside `<ng-content>` tags when appropriate
- **Avoid conditional `ng-content`** with control flow blocks
- **Use `ngProjectAs`** for content aliasing when needed

#### Template Organization

- **Use `ng-template` for reusable template fragments**:
  ```html
  <ng-template #templateRef let-data="data">
    <div>{{ data.name }}</div>
  </ng-template>
  ```
- **Use `ng-container`** for grouping elements without extra DOM nodes
- **Use `@let` variables** for complex expressions to improve readability:
  ```html
  @let userName = user.name; @let greeting = 'Hello, ' + userName;
  ```

#### Template Reference Variables

- **Use template references** for direct element/component access:
  ```html
  <input #inputRef placeholder="Enter text" /> <button (click)="handleClick(inputRef.value)">Submit</button>
  ```

### Performance Optimization

#### Deferred Loading

- **Use `@defer` strategically** for components not visible on initial load:
  ```html
  @defer (on viewport) {
  <heavy-component />
  } @placeholder {
  <div>Loading...</div>
  } @loading {
  <spinner />
  }
  ```
- **Choose appropriate triggers**: `idle`, `viewport`, `interaction`, `hover`, `timer`
- **Implement `@placeholder` and `@loading` blocks** for smooth UX
- **Use `prefetch` option** for improved perceived performance
- **Avoid deferring above-the-fold content** to prevent layout shifts

#### Pipes and Transformations

- **Use built-in pipes** for common transformations: `currency`, `date`, `titlecase`
- **Chain pipes** for multiple transformations: `{{ value | pipe1 | pipe2 }}`
- **Use pipe parameters** for customization: `{{ date | date:'hh:mm':'UTC' }}`
- **Create custom pipes** for reusable transformations
- **Prefer pure pipes** for better performance (default behavior)

### Expression Guidelines

#### Safe Practices

- **Use optional chaining `?.`** for safe property access
- **Keep expressions simple** and focused on data transformation
- **Avoid complex logic** in template expressions
- **Use computed signals** for complex derived values instead of template expressions
- **Use `this.` explicitly** when template variables might shadow class members

#### Expression Syntax

- **Use supported literals**: strings, numbers, booleans, objects, arrays
- **Avoid function calls** in expressions for performance
- **Prefer component properties** over method calls in templates

### Template Usage

```html
<!-- Use theme signal directly -->
<tui-icon [tuiTheme]="currentTheme()" [icon]="'menu'" />

<!-- Conditional rendering based on theme -->
@if (isDarkTheme()) {
<div class="dark-specific-content">Dark mode content</div>
} @else {
<div class="light-specific-content">Light mode content</div>
}
```
