# Section Header Component Usage Examples

## Basic Usage

```html
<z-section-header>
  <span title>{{ 'homepage.globalMetricsDesc' | translate }}</span>
  <span description>{{ 'panel.analyticalReportsDesc' | translate }}</span>
</z-section-header>
```

## With Custom Icon and Color

```html
<z-section-header [icon]="'@tui.trending-up'" [iconColor]="'emerald'">
  <span title>Growth Analytics</span>
  <span description>Track your organization's progress</span>
</z-section-header>
```

## Gradient Variant

```html
<z-section-header [variant]="'gradient'" [icon]="'@tui.users'" [iconColor]="'sky'">
  <span title>Team Overview</span>
  <span description>Manage your team members</span>
</z-section-header>
```

## Minimal Variant

```html
<z-section-header [variant]="'minimal'" [icon]="'@tui.settings'">
  <span title>Settings</span>
  <span description>Configure your preferences</span>
</z-section-header>
```

## Without Icon

```html
<z-section-header [showIcon]="false">
  <span title>Simple Header</span>
  <span description>A header without an icon</span>
</z-section-header>
```

## With Actions

```html
<z-section-header [hasActions]="true" [icon]="'@tui.file-text'">
  <span title>Documents</span>
  <span description>Manage your documents</span>
  <div actions>
    <button tuiButton size="s" appearance="primary">Add New</button>
    <button tuiButton size="s" appearance="secondary">Export</button>
  </div>
</z-section-header>
```

## Compact Mode

```html
<z-section-header [compact]="true" [icon]="'@tui.chart-bar'">
  <span title>Quick Stats</span>
  <span description>Overview of key metrics</span>
</z-section-header>
```

## Available Inputs

- `icon`: string (default: '@tui.bar-chart') - TUI icon to display
- `variant`: 'default' | 'gradient' | 'minimal' (default: 'default')
- `iconColor`: 'indigo' | 'sky' | 'emerald' | 'purple' | 'rose' (default: 'indigo')
- `showIcon`: boolean (default: true)
- `showDescription`: boolean (default: true)
- `hasActions`: boolean (default: false)
- `compact`: boolean (default: false)
