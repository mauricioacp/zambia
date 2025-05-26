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
