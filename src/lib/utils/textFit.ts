/**
 * TextFit algorithm for Svelte 5
 * Based on the original textFit library (https://github.com/STRML/textFit)
 * Modernized with TypeScript and made more modular
 */

export interface TextFitOptions {
  minFontSize?: number;
  maxFontSize?: number;
  mode?: 'single' | 'multi';
  alignHoriz?: 'left' | 'center' | 'right';
  alignVert?: 'top' | 'middle' | 'bottom';
  useFlexbox?: boolean;
  reProcess?: boolean;
  widthOnly?: boolean;
}

export interface TextFitResult {
  fontSize: number;
  lineHeight: number;
}

const defaultOptions: TextFitOptions = {
  minFontSize: 6,
  maxFontSize: 80,
  mode: 'multi',
  alignHoriz: 'center',
  alignVert: 'middle',
  useFlexbox: true,
  reProcess: true,
  widthOnly: false
};

/**
 * Calculates the optimal font size for text to fit in a container
 * @param element The element containing the text to fit
 * @param options Configuration options
 * @returns The optimal font size or null if the calculation failed
 */
export function calculateTextFit(
  element: HTMLElement,
  text: string,
  width: number,
  height: number,
  options: TextFitOptions = {}
): TextFitResult | null {
  const mergedOptions = { ...defaultOptions, ...options };
  const {
    minFontSize,
    maxFontSize,
    mode,
    widthOnly,
  } = mergedOptions;

  if (!element || !width || !height) {
    console.warn('TextFit: element, width and height must be specified');
    return null;
  }

  if (!text.trim()) {
    return {
      fontSize: maxFontSize!,
      lineHeight: maxFontSize! * 1.2
    };
  }
  
  // Reset styles for calculation
  element.style.maxHeight = '';
  element.style.overflow = '';
  element.style.whiteSpace = mode === 'single' ? 'nowrap' : 'normal';
  element.style.textOverflow = 'clip';
  
  // Set the text content for the calculation
  element.textContent = text;

  const availableWidth = width;
  const availableHeight = height;
  const lineHeightRatio = 1.2;

  let low = minFontSize!;
  let high = maxFontSize!;
  let optimalFontSize = maxFontSize!;  // Initially assume the maximum font size

  // First check if the maximum size fits
  element.style.fontSize = `${high}px`;
  element.style.lineHeight = `${Math.max(high * lineHeightRatio, 1)}px`;

  const maxContentWidth = element.scrollWidth;
  const maxContentHeight = element.scrollHeight;

  const maxFits = (maxContentWidth <= availableWidth) && 
                  (widthOnly || maxContentHeight <= availableHeight);

  if (maxFits) {
    // Maximum size already fits, no need for binary search
    return {
      fontSize: high,
      lineHeight: Math.max(high * lineHeightRatio, 1)
    };
  }

  // Binary search for the best fit
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    element.style.fontSize = `${mid}px`;
    element.style.lineHeight = `${Math.max(mid * lineHeightRatio, 1)}px`;

    const contentWidth = element.scrollWidth;
    const contentHeight = element.scrollHeight;

    const fitsWidth = contentWidth <= availableWidth;
    const fitsHeight = widthOnly || contentHeight <= availableHeight;

    if (fitsWidth && fitsHeight) {
      optimalFontSize = mid;
      low = mid + 1; // Try larger
    } else {
      high = mid - 1; // Try smaller
    }
  }

  return {
    fontSize: optimalFontSize,
    lineHeight: Math.max(optimalFontSize * lineHeightRatio, 1)
  };
}

/**
 * Creates a function that will debounce the execution of a callback
 * @param callback The function to debounce
 * @param wait Delay in milliseconds
 * @returns A debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  callback: T,
  wait = 10
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => callback(...args), wait);
  };
}

/**
 * Applies the text fit to an element with a debounced calculation
 * @param element The element to apply text fitting to
 * @param options Configuration options
 * @returns A cleanup function
 */
export function applyTextFit(
  element: HTMLElement,
  container: HTMLElement,
  text: string,
  options: TextFitOptions = {}
): () => void {
  const timeout: ReturnType<typeof setTimeout> | null = null;
  
  const updateFit = () => {
    if (!element || !container) return;
    
    const rect = container.getBoundingClientRect();
    const result = calculateTextFit(
      element,
      text,
      rect.width,
      rect.height,
      options
    );
    
    if (result) {
      element.style.fontSize = `${result.fontSize}px`;
      element.style.lineHeight = `${result.lineHeight}px`;
    }
  };
  
  const debouncedUpdate = debounce(updateFit);
  
  // Initial calculation
  updateFit();
  
  // Add resize observer for responsive updates
  const resizeObserver = new ResizeObserver(debouncedUpdate);
  resizeObserver.observe(container);
  
  // Cleanup function
  return () => {
    if (timeout) clearTimeout(timeout);
    resizeObserver.disconnect();
  };
} 