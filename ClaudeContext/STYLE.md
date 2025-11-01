# German Vocabulary Webapp - Design System

## Design Philosophy

Modern, clean interface with a dark theme using deep, desaturated blues as the foundation. High-saturation accent colors provide contrast and guide user attention. Design should feel calm and focused, conducive to learning.

## Color Palette

### Primary Colors (Desaturated Blues)

```css
--color-bg-primary: #0f1419;        /* Deep blue-black background */
--color-bg-secondary: #1a1f2e;      /* Slightly lighter panels */
--color-bg-tertiary: #252b3b;       /* Elevated elements (cards, modals) */
--color-bg-hover: #2d3448;          /* Hover states */
```

### Text Colors

```css
--color-text-primary: #e6e8eb;      /* Main text - high contrast */
--color-text-secondary: #9ca3af;    /* Secondary text, labels */
--color-text-tertiary: #6b7280;     /* Disabled, placeholder text */
```

### Accent Colors (High Saturation)

```css
--color-accent-primary: #3b82f6;    /* Primary actions (blue) */
--color-accent-primary-hover: #2563eb;
--color-accent-secondary: #8b5cf6;  /* Secondary actions (purple) */
--color-accent-success: #10b981;    /* Correct answers, success states */
--color-accent-error: #ef4444;      /* Wrong answers, delete actions */
--color-accent-warning: #f59e0b;    /* Warnings, attention */
--color-accent-info: #06b6d4;       /* Info, neutral highlights */
```

### Border Colors

```css
--color-border-subtle: #374151;     /* Subtle dividers */
--color-border-default: #4b5563;    /* Default borders */
--color-border-focus: #3b82f6;      /* Focus rings */
```

## Typography

### Font Families

```css
--font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
                'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 
                'Helvetica Neue', sans-serif;
--font-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 
             'Roboto Mono', monospace;
```

### Font Sizes

```css
--text-xs: 0.75rem;      /* 12px - Meta info */
--text-sm: 0.875rem;     /* 14px - Secondary text */
--text-base: 1rem;       /* 16px - Body text */
--text-lg: 1.125rem;     /* 18px - Emphasized text */
--text-xl: 1.25rem;      /* 20px - Card labels */
--text-2xl: 1.5rem;      /* 24px - Section headers */
--text-3xl: 1.875rem;    /* 30px - Page headers */
--text-4xl: 2.25rem;     /* 36px - Practice mode question */
--text-5xl: 3rem;        /* 48px - Large displays */
```

### Font Weights

```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Line Heights

```css
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

## Spacing Scale

```css
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-5: 1.25rem;    /* 20px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
```

## Border Radius

```css
--radius-sm: 0.25rem;   /* 4px - Subtle rounding */
--radius-md: 0.5rem;    /* 8px - Default */
--radius-lg: 0.75rem;   /* 12px - Cards, panels */
--radius-xl: 1rem;      /* 16px - Prominent elements */
--radius-full: 9999px;  /* Fully rounded (pills, badges) */
```

## Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 
             0 2px 4px -1px rgba(0, 0, 0, 0.3);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 
             0 4px 6px -2px rgba(0, 0, 0, 0.4);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.6), 
             0 10px 10px -5px rgba(0, 0, 0, 0.5);
```

## Component Specifications

### Buttons

**Primary Button**
- Background: `--color-accent-primary`
- Text: `--color-text-primary`
- Padding: `--space-3` `--space-6`
- Border radius: `--radius-md`
- Font weight: `--font-semibold`
- Hover: Background `--color-accent-primary-hover`, slight lift with `--shadow-md`
- Active: Slight scale down (0.98)
- Disabled: Opacity 0.5, cursor not-allowed

**Secondary Button**
- Background: `--color-bg-tertiary`
- Border: 1px solid `--color-border-default`
- Text: `--color-text-primary`
- Padding: `--space-3` `--space-6`
- Border radius: `--radius-md`
- Hover: Background `--color-bg-hover`, border `--color-border-focus`

**Danger Button**
- Background: `--color-accent-error`
- Text: white
- Other properties same as primary

**Ghost Button**
- Background: transparent
- Text: `--color-accent-primary`
- Padding: `--space-2` `--space-4`
- Hover: Background `--color-bg-hover`

### Input Fields

**Text Input**
- Background: `--color-bg-secondary`
- Border: 1px solid `--color-border-default`
- Border radius: `--radius-md`
- Padding: `--space-3` `--space-4`
- Text: `--color-text-primary`
- Font size: `--text-base`
- Focus: Border `--color-border-focus`, outline 2px `--color-accent-primary` with offset

**Select Dropdown**
- Same as text input
- Arrow icon on right side

**Textarea**
- Same as text input
- Min height: 100px
- Resize: vertical only

**Checkbox**
- Size: 20px × 20px
- Border: 2px solid `--color-border-default`
- Border radius: `--radius-sm`
- Checked: Background `--color-accent-primary`, white checkmark
- Focus: Outline `--color-border-focus`

**Radio Button**
- Size: 20px × 20px
- Border: 2px solid `--color-border-default`
- Border radius: `--radius-full`
- Selected: Background `--color-accent-primary`, inner dot
- Focus: Outline `--color-border-focus`

### Cards

**Standard Card**
- Background: `--color-bg-tertiary`
- Border radius: `--radius-lg`
- Padding: `--space-6`
- Shadow: `--shadow-md`
- Hover (if interactive): Lift with `--shadow-lg`, slight scale (1.02)

**Practice Card (Question Display)**
- Background: `--color-bg-secondary`
- Border: 2px solid `--color-border-subtle`
- Border radius: `--radius-xl`
- Padding: `--space-12`
- Min height: 300px
- Center content vertically and horizontally

### Answer Options

**Radio Option Card (Practice Mode)**
- Background: `--color-bg-tertiary`
- Border: 2px solid `--color-border-subtle`
- Border radius: `--radius-lg`
- Padding: `--space-4`
- Margin: `--space-3` 0
- Cursor: pointer
- Transition: all 0.2s ease

**States:**
- Hover: Border `--color-accent-primary`, background `--color-bg-hover`
- Selected (not submitted): Border `--color-accent-primary`, background slightly lighter
- Correct (after submit): Background `--color-accent-success`, border `--color-accent-success`, text white
- Incorrect (after submit): Background `--color-accent-error`, border `--color-accent-error`, text white

### Tables

**Table Container**
- Background: `--color-bg-secondary`
- Border radius: `--radius-lg`
- Overflow: auto (horizontal scroll on mobile)

**Table**
- Width: 100%
- Border collapse: collapse

**Table Header**
- Background: `--color-bg-tertiary`
- Text: `--color-text-secondary`
- Font weight: `--font-semibold`
- Font size: `--text-sm`
- Padding: `--space-3` `--space-4`
- Border bottom: 2px solid `--color-border-default`
- Text transform: uppercase
- Letter spacing: 0.05em

**Table Row**
- Border bottom: 1px solid `--color-border-subtle`
- Hover: Background `--color-bg-hover`
- Cursor: pointer (if clickable)

**Table Cell**
- Padding: `--space-4`
- Text: `--color-text-primary`
- Font size: `--text-base`

### Navigation

**Nav Container**
- Background: `--color-bg-secondary`
- Border bottom: 1px solid `--color-border-subtle`
- Padding: `--space-4` `--space-6`
- Display: flex
- Justify content: space-between
- Align items: center

**Nav Link**
- Text: `--color-text-secondary`
- Font weight: `--font-medium`
- Padding: `--space-2` `--space-4`
- Border radius: `--radius-md`
- Hover: Text `--color-text-primary`, background `--color-bg-hover`
- Active: Text `--color-accent-primary`, background `--color-bg-hover`

### Modals

**Overlay**
- Background: rgba(0, 0, 0, 0.7)
- Backdrop blur: 4px
- Position: fixed, full screen

**Modal Container**
- Background: `--color-bg-tertiary`
- Border: 1px solid `--color-border-default`
- Border radius: `--radius-xl`
- Max width: 600px
- Padding: `--space-8`
- Shadow: `--shadow-xl`
- Position: centered

### Tags/Badges

**Tag**
- Background: `--color-accent-primary` (opacity 0.2)
- Text: `--color-accent-primary`
- Padding: `--space-1` `--space-3`
- Border radius: `--radius-full`
- Font size: `--text-xs`
- Font weight: `--font-medium`

**Score Badge**
- Positive: Background `--color-accent-success` (opacity 0.2), text `--color-accent-success`
- Negative: Background `--color-accent-error` (opacity 0.2), text `--color-accent-error`
- Zero: Background `--color-text-tertiary` (opacity 0.2), text `--color-text-secondary`

## Layout

### Container
- Max width: 1200px
- Margin: 0 auto
- Padding: `--space-6` (mobile), `--space-8` (tablet), `--space-12` (desktop)

### Grid
- Display: grid
- Gap: `--space-6`
- Columns: 1 (mobile), 2 (tablet), 3-4 (desktop) depending on content

### Flexbox Patterns
- Use gap property instead of margins between flex items
- Consistent spacing: `--space-4` for related items, `--space-8` for sections

## Animations

### Transitions
```css
/* Default */
transition: all 0.2s ease;

/* Button hover/press */
transition: transform 0.15s ease, box-shadow 0.2s ease;

/* Modal appearance */
transition: opacity 0.3s ease, transform 0.3s ease;
```

### Loading States
- Subtle pulse animation
- Skeleton screens with gradient shimmer
- Color: `--color-bg-hover` to `--color-bg-tertiary`

## Responsive Breakpoints

```css
/* Mobile first */
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
```

### Mobile Adjustments
- Larger touch targets (minimum 44px × 44px)
- Simplified navigation (hamburger menu if needed)
- Single column layouts
- Larger text for practice mode questions

### Desktop Enhancements
- Multi-column layouts
- Hover states
- Keyboard navigation support
- More compact spacing

## Accessibility

### Focus States
- Visible focus rings (2px solid `--color-border-focus`)
- Focus offset: 2px
- Never remove focus outlines

### Color Contrast
- Text on background must meet WCAG AA standard (4.5:1)
- Accent colors chosen for sufficient contrast

### Interactive Elements
- Minimum touch target: 44px × 44px
- Clear hover/active states
- Keyboard navigable
- Semantic HTML (buttons, links, form elements)

### Screen Reader Support
- Proper ARIA labels
- Semantic heading hierarchy
- Alt text for images (if any)
- Live regions for dynamic content (score updates)

## Icons

Use a consistent icon library (recommend: Heroicons or Lucide)
- Size: 20px (default), 24px (prominent), 16px (inline)
- Color: Inherit from text or use accent colors
- Stroke width: 2px

## Loading States

**Spinner**
- Size: 40px (default), 24px (inline)
- Color: `--color-accent-primary`
- Animation: Smooth rotation

**Skeleton Screen**
- Background: `--color-bg-tertiary`
- Animated gradient overlay
- Match layout of loaded content

## Error States

**Inline Error**
- Text: `--color-accent-error`
- Font size: `--text-sm`
- Icon: Alert circle
- Display below input field

**Error Message Card**
- Background: `--color-accent-error` (opacity 0.1)
- Border: 1px solid `--color-accent-error`
- Text: `--color-accent-error`
- Icon: X circle
- Padding: `--space-4`
- Border radius: `--radius-md`

## Success States

**Success Message**
- Background: `--color-accent-success` (opacity 0.1)
- Border: 1px solid `--color-accent-success`
- Text: `--color-accent-success`
- Icon: Check circle
- Brief display (3 seconds) or dismissible

## Example Usage in CSS

```css
:root {
  /* Colors */
  --color-bg-primary: #0f1419;
  --color-bg-secondary: #1a1f2e;
  --color-bg-tertiary: #252b3b;
  --color-bg-hover: #2d3448;
  
  --color-text-primary: #e6e8eb;
  --color-text-secondary: #9ca3af;
  --color-text-tertiary: #6b7280;
  
  --color-accent-primary: #3b82f6;
  --color-accent-primary-hover: #2563eb;
  --color-accent-success: #10b981;
  --color-accent-error: #ef4444;
  
  /* Spacing */
  --space-4: 1rem;
  --space-6: 1.5rem;
  
  /* Typography */
  --text-base: 1rem;
  --font-primary: -apple-system, system-ui, sans-serif;
  
  /* Radius */
  --radius-md: 0.5rem;
  
  /* Shadows */
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
}

.button-primary {
  background: var(--color-accent-primary);
  color: var(--color-text-primary);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.button-primary:hover {
  background: var(--color-accent-primary-hover);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}
```

## Component Library Preferences

If using a component library, prefer:
- Tailwind CSS (with custom theme matching this design system)
- Headless UI (for accessible components)
- Radix UI (for complex components like dropdowns, modals)

Configure to match this design system's colors and spacing.