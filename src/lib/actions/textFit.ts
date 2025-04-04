import type { Action } from 'svelte/action';
import { calculateTextFit, type TextFitOptions } from '../utils/textFit';

export interface TextFitActionParams extends TextFitOptions {
  text: string;
  containerWidth?: number;
  containerHeight?: number;
}

/**
 * Svelte action for applying text fitting to an element
 * Usage: <div use:textFit={{ text: 'Hello world', maxFontSize: 48 }}>Hello world</div>
 */
export const textFit: Action<HTMLElement, TextFitActionParams> = (
  node,
  params
) => {
  if (!params || !params.text) {
    console.warn('textFit action requires text parameter');
    return {};
  }
  
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastParams = { ...params };
  let isActive = true;
  
  function updateFit() {
    if (!isActive) return;

    const containerWidth = params.containerWidth || node.clientWidth;
    const containerHeight = params.containerHeight || node.clientHeight;
    
    if (!containerWidth || !containerHeight) return;
    
    // Set text content for calculation
    // Store the original content if needed for later restoration
    const originalText = node.textContent;
    
    // Check if we need to update the node text
    if (originalText !== params.text) {
      node.textContent = params.text;
    }
    
    const result = calculateTextFit(
      node,
      params.text,
      containerWidth,
      containerHeight,
      {
        minFontSize: params.minFontSize,
        maxFontSize: params.maxFontSize,
        mode: params.mode,
        widthOnly: params.widthOnly,
        paddingX: params.paddingX,
        paddingY: params.paddingY
      }
    );
    
    if (result) {
      // Apply the calculated styles
      node.style.fontSize = `${result.fontSize}px`;
      node.style.lineHeight = `${result.lineHeight}px`;
      
      if (params.mode === 'single') {
        node.style.whiteSpace = 'nowrap';
      } else {
        node.style.whiteSpace = 'normal';
      }
    }
  }
  
  // Debounced update function
  function debouncedUpdate() {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(updateFit, 10);
  }
  
  // Initialize
  updateFit();
  
  // Set up resize observer for responsive updates
  const resizeObserver = new ResizeObserver(debouncedUpdate);
  resizeObserver.observe(node);
  
  return {
    update(newParams: TextFitActionParams) {
      params = newParams;
      const hasSignificantChange = 
        lastParams.text !== newParams.text ||
        lastParams.minFontSize !== newParams.minFontSize ||
        lastParams.maxFontSize !== newParams.maxFontSize ||
        lastParams.mode !== newParams.mode;
        
      lastParams = { ...newParams };
      
      if (hasSignificantChange) {
        debouncedUpdate();
      }
    },
    
    destroy() {
      isActive = false;
      if (timeoutId) clearTimeout(timeoutId);
      if (resizeObserver) resizeObserver.disconnect();
    }
  };
}; 