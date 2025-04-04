# TextFit for Svelte 5

A modern, TypeScript implementation of the textFit algorithm for Svelte 5. This library automatically resizes text to fit its container perfectly.

## Features

- **Fast performance** using binary search algorithm
- **Multiple usage options**:
  - Svelte component
  - Svelte action
  - Utility functions
- **Type-safe APIs** with TypeScript
- **Responsive** automatic recalculation on resize
- **Flexible options** for fine-tuned control

## Installation

The TextFit functionality is built into this application. If you want to extract it for use in other projects, copy the following files:

- `src/lib/TextFit.svelte` - The component
- `src/lib/actions/textFit.ts` - The action
- `src/lib/utils/textFit.ts` - The utility functions
- `src/lib/index.ts` - The exports

## Usage

### As a Component

```svelte
<script>
  import { TextFit } from '$lib';
</script>

<TextFit
  text="Hello World"
  width={300}
  height={100}
  minFontSize={10}
  maxFontSize={48}
  mode="multi"
  bold={true}
  color="white"
  className="my-custom-class"
/>
```

### As an Action

```svelte
<script>
  import { textFit } from '$lib';
  
  let text = 'This text will automatically fit';
</script>

<div 
  use:textFit={{ 
    text, 
    minFontSize: 10, 
    maxFontSize: 48,
    mode: 'multi'
  }}
  class="w-64 h-32 bg-blue-500 text-white p-4"
>
  {text}
</div>
```

### Using Utility Functions

```typescript
import { calculateTextFit, applyTextFit } from '$lib';

// Calculate best font size
const result = calculateTextFit(
  myElement,
  'My text',
  300,
  100,
  { minFontSize: 10, maxFontSize: 48 }
);

// Apply font sizing with automatic updates
const cleanup = applyTextFit(
  textElement,
  containerElement,
  'My text',
  { mode: 'multi' }
);

// Call cleanup function to remove observers when done
cleanup();
```

## API Reference

### TextFit Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| text | string | '' | Text content to fit |
| width | number | - | Container width in pixels |
| height | number | - | Container height in pixels |
| minFontSize | number | 6 | Minimum font size in pixels |
| maxFontSize | number | 80 | Maximum font size in pixels |
| mode | 'single' \| 'multi' | 'multi' | Single or multi-line mode |
| alignHoriz | 'left' \| 'center' \| 'right' | 'center' | Horizontal alignment |
| alignVert | 'top' \| 'middle' \| 'bottom' | 'middle' | Vertical alignment |
| useFlexbox | boolean | true | Use flexbox for alignment |
| reProcess | boolean | true | Recalculate on prop changes |
| widthOnly | boolean | false | Only consider width when fitting |
| paddingX | number | 4 | Horizontal padding in pixels |
| paddingY | number | 2 | Vertical padding in pixels |
| color | string | 'inherit' | Text color |
| bold | boolean | false | Bold text |
| italic | boolean | false | Italic text |
| className | string | '' | Additional CSS classes |

### textFit Action Parameters

The action accepts the same options as the component, with the text parameter being required.

### Utility Functions

- `calculateTextFit(element, text, width, height, options)`: Core calculation function
- `applyTextFit(element, container, text, options)`: Sets up automatic resizing
- `debounce(callback, wait)`: Utility for debouncing function calls

## Examples

See the example pages in the application:
- Main page with component usage
- `/action-example` for action usage examples

## License

MIT 