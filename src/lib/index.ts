// place files you want to import through the `$lib` alias in this folder.

// Components
export { default as TextFit } from './TextFit.svelte';

// Actions
export { textFit } from './actions/textFit';

// Utilities
export { 
  calculateTextFit, 
  applyTextFit, 
  debounce 
} from './utils/textFit';

// Types
export type { 
  TextFitOptions, 
  TextFitResult 
} from './utils/textFit';

export type { 
  TextFitActionParams 
} from './actions/textFit';
