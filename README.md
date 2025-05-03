# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## SCSS Structure

This project uses a modular SCSS architecture based on the 7-1 pattern (7 folders, 1 main file). The structure is organized as follows:

```
src/lib/styles/
|
|– abstracts/            # Tools and helpers
|   |– _variables.scss   # Global variables
|   |– _functions.scss   # Custom functions
|   |– _mixins.scss      # Custom mixins
|   |– _placeholders.scss # Placeholders & extends
|
|– base/                 # Project foundation
|   |– _reset.scss       # Reset/normalize
|   |– _typography.scss  # Typography rules
|   |– _utilities.scss   # Utility classes
|
|– components/           # UI components
|   |– _buttons.scss     # Buttons
|   |– _forms.scss       # Forms
|   |– _cards.scss       # Cards
|   |– ...               # Etc.
|
|– layout/               # Layout components
|   |– _header.scss      # Header
|   |– _footer.scss      # Footer
|   |– _navigation.scss  # Navigation
|   |– _grid.scss        # Grid system
|
|– pages/                # Page-specific styles
|   |– _home.scss        # Home page
|   |– ...               # Other pages
|
|– themes/               # Theme styles
|   |– _default.scss     # Default theme
|   |– _dark.scss        # Dark theme
|
|– vendors/              # Third-party CSS
|   |– ...               # Any third-party styles
|
|– main.scss             # Main file that imports everything
```

### Detailed Component Breakdown

#### Abstracts

- **_variables.scss**: Defines global design tokens including colors, typography, spacing, borders, shadows, z-indices, breakpoints, and grid settings.
  ```scss
  $color-primary: #4682B4;            // Steel Blue
  $font-size-base: 1rem;
  $space-4: 1rem;                     // 16px
  $border-radius: 0.25rem;
  $breakpoint-md: 768px;
  ```

- **_functions.scss**: Contains utility functions for transformations like px to rem/em, color manipulations, z-index management, and spacing calculations.
  ```scss
  @function rem($pixels, $context: 16) {
    @return ($pixels / $context) * 1rem;
  }

  @function spacing($size) {
    // Returns standardized spacing values
  }
  ```

- **_mixins.scss**: Provides reusable code blocks for responsive design, flex/grid layouts, container sizing, typography, transitions, and component variants.
  ```scss
  @mixin respond-to($breakpoint) {
    // Media query handler for responsive design
  }

  @mixin container($padding: $space-4) {
    // Container sizing with breakpoints
  }
  ```

- **_placeholders.scss**: Defines extendable styles for common patterns like containers, clearfix, text truncation, list reset, button reset, and more.
  ```scss
  %list-reset {
    list-style: none;
    padding-left: 0;
    margin: 0;
  }
  ```

#### Base

- **_reset.scss**: Modern CSS reset that normalizes browser defaults, sets box-sizing, removes margins/padding, and establishes sensible defaults.
  ```scss
  *, *::before, *::after {
    box-sizing: border-box;
  }
  ```

- **_typography.scss**: Typography system with responsive font sizing, heading hierarchies, paragraph styles, lists, links, code blocks, and text utilities.
  ```scss
  h1 {
    font-size: $font-size-2xl;
    line-height: $line-height-tight;
    
    @include respond-to(md) {
      font-size: $font-size-3xl;
    }
  }
  ```

- **_utilities.scss**: Comprehensive utility classes for display, flex/grid, spacing, colors, borders, positioning, visibility, sizing, and more.
  ```scss
  .d-flex { display: flex !important; }
  .mt-4 { margin-top: spacing(4) !important; }
  .text-primary { color: $color-primary !important; }
  ```

#### Layout

- **_grid.scss**: Flexible grid system with container classes, rows/columns, responsive column sizing, order controls, offset options, and CSS Grid utilities.
  ```scss
  .container {
    @extend %container;
  }
  
  .row {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -#{$grid-gutter-width / 2};
  }
  ```

- **_header.scss**: Sticky header component with logo, responsive navigation, menu items, and mobile toggle functionality.
  ```scss
  .header {
    position: sticky;
    top: 0;
    z-index: $z-index-sticky;
    box-shadow: $box-shadow;
  }
  ```

- **_footer.scss**: Adaptable footer with responsive grid layout, brand section, navigation lists, social icons, and copyright/legal links.
  ```scss
  .footer__grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    
    @include respond-to(lg) {
      grid-template-columns: 2fr 1fr 1fr 1fr;
    }
  }
  ```

- **_navigation.scss**: Navigation patterns including main nav, mobile toggles, dropdowns, and breadcrumbs with responsive behavior.
  ```scss
  .dropdown__menu {
    position: absolute;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease, transform 0.2s ease;
  }
  ```

#### Components

- **_buttons.scss**: Comprehensive button system with variants (primary, secondary, etc.), sizes, states, shapes, and button groups.
  ```scss
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: $space-2 $space-4;
    border-radius: $border-radius;
  }
  
  .btn--primary {
    @include button-variant($color-primary);
  }
  ```

- **_forms.scss**: Form controls, labels, feedback states, custom inputs (select, checkbox, radio, file, range), switches, and floating labels.
  ```scss
  .form-control {
    display: block;
    width: 100%;
    padding: $space-2 $space-3;
    border: 1px solid $color-gray-400;
    border-radius: $border-radius;
  }
  ```

- **_cards.scss**: Card components with variants, body, header/footer, images, overlays, and responsive card grids.
  ```scss
  .card {
    display: flex;
    flex-direction: column;
    border-radius: $border-radius;
    box-shadow: $box-shadow-sm;
    transition: box-shadow 0.3s ease, transform 0.3s ease;
  }
  ```

#### Pages

- **_home.scss**: Page-specific styles for the home page including hero section, features grid, testimonials, and call-to-action sections.
  ```scss
  .hero {
    position: relative;
    padding: $space-12 0;
    background-color: $color-gray-100;
    overflow: hidden;
  }
  
  .features__grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    
    @include respond-to(lg) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  ```

#### Themes

- **_default.scss**: Default theme for the application with customizations for typography, colors, component styling, and browser-specific enhancements.
  ```scss
  .theme-default {
    .card:hover {
      transform: translateY(-5px);
      box-shadow: $box-shadow-md;
    }
    
    ::selection {
      background-color: rgba($color-primary, 0.2);
    }
  }
  ```

### Usage

The SCSS structure follows these principles:

1. **Variables & Configuration**: All global variables are defined in the abstracts folder
2. **Component-Based**: Each UI component has its own SCSS file
3. **Responsive by Default**: Built with mobile-first approach
4. **Modular & Reusable**: Styles are organized to prevent duplication
5. **BEM Methodology**: Block Element Modifier naming convention for classes

To use these styles in your Svelte components:

```svelte
<script>
  import '$lib/styles/main.scss';
  // Component code
</script>
```

You can also import specific modules in components that need them:

```svelte
<script>
  import '$lib/styles/components/_buttons.scss';
  // Component code
</script>
```

### Best Practices

1. **Always use variables**: Instead of hardcoding values, reference variables from _variables.scss
2. **Follow BEM naming**: Use Block__Element--Modifier pattern for class names (e.g., .card__title, .btn--primary)
3. **Mobile-first approach**: Start with mobile styles and add breakpoints using the respond-to mixin
4. **Avoid deep nesting**: Limit nesting to 3 levels maximum to prevent specificity issues
5. **Utility classes**: Use utility classes for minor adjustments rather than creating custom CSS
