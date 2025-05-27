# Zambia UI Components Style Guide

This document provides comprehensive guidelines for using and extending the Zambia UI Components library. It covers color schemes, typography, component patterns, and best practices for both light and dark themes.

## Table of Contents

- [Color Palette](#color-palette)
- [Typography](#typography)
- [Theming System](#theming-system)
- [Component Guidelines](#component-guidelines)
- [Layout & Spacing](#layout--spacing)
- [Accessibility](#accessibility)
- [Best Practices](#best-practices)

## Color Palette

The Zambia UI Components library uses Tailwind CSS color classes with a consistent palette for both light and dark themes.

### Light Theme Colors

| Element          | Background                      | Text                             | Border/Accent       |
| ---------------- | ------------------------------- | -------------------------------- | ------------------- |
| Primary UI       | `bg-white`                      | `text-gray-800`                  | `ring-sky-500`      |
| Secondary/Subtle | `bg-gray-50`, `bg-gray-100`     | `text-gray-500`, `text-gray-600` | `border-gray-200`   |
| Accent - Blue    | `bg-blue-50`, `bg-blue-500`     | `text-blue-600`                  | `border-blue-400`   |
| Accent - Green   | `bg-green-50`, `bg-green-500`   | `text-green-600`                 | `border-green-400`  |
| Accent - Purple  | `bg-purple-50`, `bg-purple-500` | `text-purple-600`                | `border-purple-400` |
| Accent - Yellow  | `bg-yellow-50`, `bg-yellow-500` | `text-yellow-600`                | `border-yellow-400` |
| Accent - Red     | `bg-red-50`, `bg-red-500`       | `text-red-600`                   | `border-red-400`    |
| Shadows          | `shadow-md`                     | -                                | -                   |

### Dark Theme Colors

| Element          | Background                              | Text                                           | Border/Accent            |
| ---------------- | --------------------------------------- | ---------------------------------------------- | ------------------------ |
| Primary UI       | `dark:bg-slate-800`, `dark:bg-gray-800` | `dark:text-white`, `dark:text-slate-100`       | `dark:ring-sky-500`      |
| Secondary/Subtle | `dark:bg-gray-900`, `dark:bg-gray-700`  | `dark:text-gray-300`, `dark:text-slate-400`    | `dark:border-gray-700`   |
| Accent - Blue    | `dark:bg-blue-900/30`                   | `dark:text-blue-300`, `dark:text-blue-400`     | `dark:border-blue-500`   |
| Accent - Green   | `dark:bg-green-900/30`                  | `dark:text-green-300`, `dark:text-green-400`   | `dark:border-green-500`  |
| Accent - Purple  | `dark:bg-purple-900/30`                 | `dark:text-purple-300`, `dark:text-purple-400` | `dark:border-purple-500` |
| Accent - Yellow  | `dark:bg-yellow-900/30`                 | `dark:text-yellow-300`, `dark:text-yellow-400` | `dark:border-yellow-500` |
| Accent - Red     | `dark:bg-red-900/30`                    | `dark:text-red-300`, `dark:text-red-400`       | `dark:border-red-500`    |
| Shadows          | `dark:shadow-gray-900/30`               | -                                              | -                        |

## Typography

The library uses a consistent typography system based on Tailwind CSS classes:

### Font Sizes

- Headings:
  - H1: `text-2xl font-bold`
  - H2: `text-xl font-semibold`
  - H3: `text-lg font-semibold`
- Body Text:
  - Default: Base font size (no class needed)
  - Small: `text-sm`
  - Extra Small: `text-xs`
- Special Text:
  - Numbers/Stats: `text-2xl`, `text-3xl` with `font-bold`

### Font Weights

- `font-normal`: Regular text
- `font-medium`: Slightly emphasized text
- `font-semibold`: Sub-headings and important UI elements
- `font-bold`: Headings and key numbers/statistics

### Text Colors

- Primary text:
  - Light: `text-gray-800`
  - Dark: `dark:text-white`, `dark:text-slate-100`
- Secondary text:
  - Light: `text-gray-500`, `text-gray-600`
  - Dark: `dark:text-gray-400`, `dark:text-slate-400`

## Theming System

The Zambia UI Components library implements a dual-theme system (light and dark) using Tailwind CSS's dark mode feature.

### Implementation

Dark mode is implemented using Tailwind's `dark:` prefix classes. The application uses a class-based dark mode strategy, where the `dark` class is added to the HTML root element to activate dark mode.

### Theme Switching

Theme switching is handled by the `ThemeService` which:

- Toggles the `dark` class on the HTML element
- Persists theme preference in localStorage
- Provides signals for components to react to theme changes

### Using Themes in Components

When creating or modifying components, always include both light and dark theme styles:

```html
<div class="bg-white text-gray-800 dark:bg-slate-800 dark:text-white">
  <!-- Component content -->
</div>
```

## Component Guidelines

### Cards

Cards use a consistent pattern:

- Light theme: White background (`bg-white`), medium shadow (`shadow-md`), gray text
- Dark theme: Slate background (`dark:bg-slate-800`), custom shadow (`dark:shadow-gray-900/30`), light text

Example:

```html
<div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 dark:shadow-gray-900/30">
  <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Card Title</h2>
  <p class="text-gray-600 dark:text-gray-300">Card content goes here</p>
</div>
```

### Buttons

Buttons follow these patterns:

- Primary: Blue background with white text
- Secondary: Gray background or outlined
- Always include hover states

Example:

```html
<button class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
  Button Text
</button>
```

### Icons

Icons should:

- Use consistent sizing
- Inherit color from parent text by default
- Use Taiga UI icons (Lucide icons)

Example:

```html
<tui-icon
  [attr.aria-label]="icon() + ' icon'"
  [icon]="icon()"
  [style.background]="progressTextColor()"
  [style.color]="'white'"
  [style.font-size.rem]="2"
/>
```

### Form Elements

Form elements should:

- Have consistent padding and border radius
- Include proper focus states
- Support both themes

## Layout & Spacing

### Spacing Scale

The library uses Tailwind's spacing scale:

- `p-4`, `m-4`: Standard padding/margin (1rem)
- `p-6`, `m-6`: Larger padding/margin (1.5rem)
- `px-4 py-2`: Horizontal/vertical padding for buttons
- `space-y-3`: Vertical spacing between child elements

### Container Patterns

- Page containers: `p-6` padding, full width
- Cards: Rounded corners (`rounded-lg`), padding (`p-4` or `p-6`)
- Form groups: Vertical spacing (`space-y-4`)

### Responsive Design

- Use Tailwind's responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
- Mobile-first approach (default styles for mobile, then add responsive variants)
- Common patterns:
  - Single column on mobile, multi-column on larger screens
  - Example: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`

## Accessibility

### Color Contrast

- Ensure sufficient contrast between text and background
- Use Tailwind's color scale appropriately (500+ for text on light backgrounds, 300/400 for dark backgrounds)

### Focus States

- All interactive elements should have visible focus states
- Use Tailwind's `focus:` variants

### Semantic HTML

- Use appropriate HTML elements (`button` for buttons, `a` for links)
- Include proper ARIA attributes when needed

## Best Practices

### Adding New Components

1. Follow existing patterns for component structure
2. Include both light and dark theme styles
3. Use Tailwind classes for styling when possible
4. Add custom CSS only when necessary

### Modifying Existing Components

1. Maintain support for both light and dark themes
2. Ensure changes are consistent with the overall design system
3. Test in both themes before committing changes

### Theme-Specific Considerations

- Don't rely solely on color to convey information
- Test all components in both themes
- Consider using opacity for subtle backgrounds in dark mode (e.g., `dark:bg-blue-900/30`)

## Boxed Glass Style Components

The Zambia UI library features a modern "boxed glass" design pattern that combines clean geometric shapes with subtle transparency effects and sophisticated hover interactions.

### Core Boxed Glass Pattern

```html
<!-- Standard Boxed Glass Card -->
<div
  class="group relative overflow-hidden rounded-2xl border border-gray-200/50 bg-white/90 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm transition-all duration-300 hover:border-gray-300/70 hover:shadow-xl hover:shadow-gray-900/10 dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20 dark:hover:border-slate-600/70 dark:hover:shadow-slate-900/40"
>
  <div class="relative z-10">
    <h3 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Title</h3>
    <p class="text-gray-600 dark:text-gray-300">Content with subtle transparency</p>
  </div>
  <!-- Optional subtle background pattern -->
  <div
    class="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-slate-700/30"
  ></div>
</div>
```

### Boxed Glass Key Features

1. **Glass Morphism Effects**:

   - Semi-transparent backgrounds (`bg-white/90`, `dark:bg-slate-800/90`)
   - Backdrop blur for depth (`backdrop-blur-sm`)
   - Subtle border overlays (`border-gray-200/50`)

2. **Enhanced Shadows**:

   - Multi-layered shadow system
   - Color-tinted shadows that match theme
   - Progressive shadow intensity on hover

3. **Smooth Interactions**:
   - Extended transition duration (`duration-300`)
   - Gradient overlays on hover
   - Border color transitions

### Boxed Glass Variations

#### Action Card with Glass Effect

```html
<button
  class="group relative overflow-hidden rounded-2xl border border-gray-200/50 bg-white/90 p-6 text-left shadow-lg shadow-gray-900/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-blue-300/70 hover:shadow-xl hover:shadow-blue-500/20 dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-slate-900/20 dark:hover:border-blue-600/70 dark:hover:shadow-blue-400/20"
>
  <div class="relative z-10 flex items-center gap-4">
    <div class="rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-3 shadow-lg shadow-blue-500/25">
      <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <!-- icon path -->
      </svg>
    </div>
    <div>
      <h3 class="font-semibold text-gray-900 dark:text-white">Action Title</h3>
      <p class="text-sm text-gray-600 dark:text-gray-300">Action description</p>
    </div>
  </div>
  <!-- Hover overlay with blue tint -->
  <div
    class="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-blue-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
  ></div>
</button>
```

#### Info Panel Glass Style

```html
<div
  class="rounded-2xl border border-gray-200/60 bg-white/80 p-8 shadow-xl shadow-gray-900/8 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-800/80 dark:shadow-slate-900/30"
>
  <div class="space-y-4">
    <div class="flex items-center gap-3">
      <div class="h-2 w-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></div>
      <h4 class="font-medium text-gray-900 dark:text-white">Status Indicator</h4>
    </div>
    <div class="space-y-2 pl-5">
      <p class="text-gray-700 dark:text-gray-200">Primary information</p>
      <p class="text-sm text-gray-500 dark:text-gray-400">Secondary details</p>
    </div>
  </div>
</div>
```

#### Layered Glass Form Container

Advanced glass morphism with layered effects and background glow:

```html
<!-- Form Container with Glow Effect -->
<div class="relative mx-auto max-w-lg">
  <!-- Background Glow -->
  <div
    class="absolute inset-0 -inset-x-6 rounded-3xl bg-gradient-to-b from-blue-300 via-teal-500 to-blue-700 opacity-15 blur-xl"
  ></div>

  <!-- Glass Container -->
  <div
    class="relative rounded-2xl bg-white/40 p-2.5 ring-1 ring-gray-200/50 backdrop-blur-xs dark:bg-gray-500/20 dark:ring-gray-700/60"
  >
    <!-- Inner Content -->
    <div class="rounded-xl bg-white p-6 lg:p-12 dark:bg-gray-950">
      <!-- Form content goes here -->
      <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Form Title</h2>
      <p class="text-gray-600 dark:text-gray-300">Form description or content</p>
    </div>
  </div>
</div>
```

#### Authentication Glass Card

Specialized pattern for auth forms with enhanced visual hierarchy:

```html
<div class="relative mx-auto max-w-md">
  <!-- Gradient Background Glow -->
  <div
    class="absolute inset-0 -inset-x-4 rounded-3xl bg-gradient-to-br from-purple-300 via-blue-400 to-teal-500 opacity-20 blur-2xl"
  ></div>

  <!-- Glass Frame -->
  <div
    class="relative rounded-2xl bg-white/30 p-3 ring-1 ring-white/20 backdrop-blur-sm dark:bg-gray-800/30 dark:ring-gray-700/40"
  >
    <!-- Content Card -->
    <div class="rounded-xl bg-white/95 p-8 shadow-xl shadow-gray-900/5 dark:bg-gray-950/95 dark:shadow-slate-900/20">
      <div class="mb-6 text-center">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Sign in to your account</p>
      </div>
      <!-- Form elements -->
    </div>
  </div>
</div>
```

#### Modal Glass Overlay

Glass effect for modal dialogs and overlays:

```html
<!-- Modal Background -->
<div class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 backdrop-blur-sm">
  <!-- Modal Container -->
  <div class="relative mx-4 w-full max-w-lg">
    <!-- Glow Effect -->
    <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-purple-500 opacity-10 blur-xl"></div>

    <!-- Glass Modal -->
    <div
      class="relative rounded-2xl border border-white/30 bg-white/80 p-1 shadow-2xl backdrop-blur-md dark:border-gray-700/50 dark:bg-gray-800/80"
    >
      <!-- Modal Content -->
      <div class="rounded-xl bg-white p-6 dark:bg-gray-900">
        <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Modal Title</h3>
        <p class="text-gray-600 dark:text-gray-300">Modal content goes here...</p>
      </div>
    </div>
  </div>
</div>
```

### Glass Effect Specifications

#### Layered Glass Architecture

The advanced glass system uses a three-layer approach for maximum depth and visual impact:

1. **Background Glow Layer** (outermost)

   - Gradient blur effects with extended insets
   - Low opacity (10-20%) for subtle enhancement
   - `blur-xl` or `blur-2xl` for soft diffusion

2. **Glass Frame Layer** (middle)

   - Semi-transparent background (`bg-white/30` to `/40`)
   - Ring borders with transparency (`ring-1 ring-gray-200/50`)
   - Backdrop blur for glass effect (`backdrop-blur-xs` to `backdrop-blur-sm`)

3. **Content Layer** (innermost)
   - High opacity or solid backgrounds (`bg-white/95` or `bg-white`)
   - Clean content presentation
   - Proper contrast for readability

#### Transparency Levels

- **Glass frames**: `bg-white/30` to `bg-white/40` (light), `bg-gray-500/20` to `bg-gray-800/30` (dark)
- **Content layers**: `bg-white/95` to `bg-white` (light), `bg-gray-950/95` to `bg-gray-950` (dark)
- **Glow effects**: `opacity-10` to `opacity-20`

#### Border Treatments

- **Ring borders**: `ring-1 ring-gray-200/50` (light), `ring-gray-700/40` to `ring-gray-700/60` (dark)
- **Enhanced borders**: `ring-white/20` to `ring-white/30` for premium effects
- **Content borders**: `border border-white/30` for modal overlays

#### Background Glow Patterns

```css
/* Authentication/Form Glow */
bg-gradient-to-b from-blue-300 via-teal-500 to-blue-700 opacity-15 blur-xl

/* Premium/Modal Glow */
bg-gradient-to-br from-purple-300 via-blue-400 to-teal-500 opacity-20 blur-2xl

/* Action/Interactive Glow */
bg-gradient-to-r from-blue-400 to-purple-500 opacity-10 blur-xl
```

#### Shadow System

```css
/* Light theme shadows */
shadow-lg shadow-gray-900/5          /* Glass base */
shadow-xl shadow-gray-900/5          /* Content layer */
shadow-2xl                           /* Modal overlays */

/* Dark theme shadows */
shadow-slate-900/20                  /* Glass base */
shadow-slate-900/20                  /* Content layer */
shadow-2xl                           /* Modal overlays */
```

#### Backdrop Blur Levels

- **Subtle effect**: `backdrop-blur-xs` (minimal blur)
- **Standard effect**: `backdrop-blur-sm` (recommended)
- **Enhanced effect**: `backdrop-blur-md` (for overlays)

## Interactive Action Cards

Interactive action cards provide an engaging way to present quick actions and navigation options. These cards feature modern design elements including gradients, hover effects, and smooth animations.

### Design Pattern

```html
<button
  class="group relative overflow-hidden rounded-xl bg-white p-6 text-left shadow-sm transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10 dark:bg-slate-800 dark:hover:shadow-blue-400/10"
>
  <div class="flex items-center gap-4">
    <div class="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 p-3">
      <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        ></path>
      </svg>
    </div>
    <div>
      <h3 class="font-semibold text-gray-900 dark:text-white">Card Title</h3>
      <p class="text-sm text-gray-600 dark:text-gray-300">Card description</p>
    </div>
  </div>
  <div class="absolute inset-0 bg-blue-500 opacity-0 transition-opacity duration-200 group-hover:opacity-10"></div>
</button>
```

### Key Features

1. **Modern Aesthetics**:

   - Rounded corners (`rounded-xl`)
   - Gradient icon backgrounds
   - Glass-morphism effects with backdrop blur
   - Subtle shadows with color tinting on hover

2. **Interactive Elements**:

   - Smooth transitions (`transition-all duration-200`)
   - Scale transforms on hover (`hover:scale-105`)
   - Color-coordinated shadow effects
   - Opacity overlays for enhanced interactivity

3. **Accessibility**:
   - Proper button semantics
   - Focus states included
   - High contrast text combinations
   - Screen reader friendly structure

### Color Variations

Use consistent gradient patterns for different action types:

```css
/* Executive Actions */
bg-gradient-to-r from-purple-500 to-pink-500

/* Management Actions */
bg-gradient-to-r from-emerald-500 to-teal-500

/* Navigation Actions */
bg-gradient-to-r from-blue-500 to-blue-600

/* Information Actions */
bg-gradient-to-r from-indigo-500 to-purple-500

/* Warning/Important Actions */
bg-gradient-to-r from-orange-500 to-red-500

/* Headquarters/Location Actions */
bg-gradient-to-r from-cyan-500 to-blue-500
```

### Implementation Notes

- Always include both light and dark theme variants
- Use semantic HTML (`button` for interactive elements)
- Maintain consistent spacing and proportions
- Include loading states when actions trigger API calls
- Consider adding subtle animations for enhanced user experience
