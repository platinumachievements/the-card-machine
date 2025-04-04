<script lang="ts">
	/**
	 * TextFit component for Svelte 5
	 * Automatically fits text to the width and/or height of its container
	 * Inspired by textFit.js (https://github.com/STRML/textFit)
	 */

	import { onMount } from 'svelte';
	import { calculateTextFit, type TextFitOptions } from './utils/textFit';

	// Props with defaults
	let {
		text = '',
		minFontSize = 6,
		maxFontSize = 80,
		mode = 'multi' as 'single' | 'multi', // 'single' or 'multi' line mode
		alignHoriz = 'center', // 'left', 'center', 'right'
		alignVert = 'middle', // 'top', 'middle', 'bottom'
		useFlexbox = true,
		reProcess = true,
		widthOnly = false,
		color = 'inherit',
		bold = false,
		italic = false,
		className = '',
		width,
		height,
		currentFontSize = $bindable(maxFontSize)
	} = $props();

	let mounted = $state(false);
	let calculating = $state(false);
	let processed = $state(false);
	let prevProps = $state('');
	let containerElement: HTMLDivElement;
	let textElement: HTMLDivElement;

	// Validate props
	$effect(() => {
		minFontSize = Math.max(6, minFontSize);
		maxFontSize = Math.max(minFontSize, maxFontSize);
		if (!width || !height) {
			console.warn('TextFit: width and height must be specified');
		}
	});

	function getPropsString() {
		return `${text}_${width}_${height}_${maxFontSize}_${minFontSize}_${mode}`;
	}

	function performTextFit() {
		if (!textElement || calculating || !mounted) return;

		if (!text.trim()) {
			currentFontSize = maxFontSize;
			textElement.style.fontSize = `${currentFontSize}px`;
			processed = true;
			return;
		}

		if (processed && !reProcess) return;

		const newPropsString = getPropsString();
		if (newPropsString === prevProps) return;
		prevProps = newPropsString;

		calculating = true;

		try {
			const options: TextFitOptions = {
				minFontSize,
				maxFontSize,
				mode,
				widthOnly
			};

			const result = calculateTextFit(textElement, text, width, height, options);

			if (result) {
				currentFontSize = result.fontSize;
				textElement.style.fontSize = `${result.fontSize}px`;
				textElement.style.lineHeight = `${result.lineHeight}px`;
			}

			processed = true;
		} finally {
			calculating = false;
		}
	}

	// Debounced calculation
	let timeout: ReturnType<typeof setTimeout> | null = null;
	function debouncedCalculate() {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => {
			if (mounted && textElement) {
				performTextFit();
			}
		}, 10);
	}

	onMount(() => {
		mounted = true;
		debouncedCalculate();
		return () => {
			if (timeout) clearTimeout(timeout);
		};
	});

	$effect(() => {
		void getPropsString();
		if (mounted && textElement) {
			debouncedCalculate();
		}
	});
</script>

<div
	bind:this={containerElement}
	class="textfit-container {className}"
	data-align-horiz={alignHoriz}
	data-align-vert={alignVert}
	data-use-flexbox={useFlexbox ? 'true' : 'false'}
	style="
		width: {width}px;
		height: {height}px;
	"
>
	<div
		bind:this={textElement}
		class="textfit-text"
		style="
			font-size: {currentFontSize}px;
			color: {color};
			font-weight: {bold ? 'bold' : 'normal'};
			font-style: {italic ? 'italic' : 'normal'};
		"
	>
		{text}
	</div>
</div>

<style>
	.textfit-container {
		display: flex;
		overflow: hidden;
		box-sizing: border-box;
	}

	.textfit-container[data-align-horiz='left'] {
		justify-content: flex-start;
		text-align: left;
	}

	.textfit-container[data-align-horiz='center'] {
		justify-content: center;
		text-align: center;
	}

	.textfit-container[data-align-horiz='right'] {
		justify-content: flex-end;
		text-align: right;
	}

	.textfit-container[data-align-vert='top'] {
		align-items: flex-start;
	}

	.textfit-container[data-align-vert='middle'] {
		align-items: center;
	}

	.textfit-container[data-align-vert='bottom'] {
		align-items: flex-end;
	}

	.textfit-text {
		width: 100%;
		word-break: break-word;
		overflow: hidden;
	}
</style>
