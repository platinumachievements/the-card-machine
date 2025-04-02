<script lang="ts">
	import { onMount } from 'svelte';

	// Props with defaults
	let {
		text = '',
		width = 200,
		height = 40,
		maxFontSize = 24,
		minFontSize = 8,
		paddingX = 4,
		paddingY = 2,
		alignH = 'center', // 'left', 'center', 'right'
		alignV = 'middle', // 'top', 'middle', 'bottom'
		maxLines = 3,
		className = '',
		bold = false,
		italic = false,
		color = 'inherit'
	} = $props();

	let textElement: HTMLDivElement;
	let currentFontSize = $state(maxFontSize);
	let mounted = $state(false);
	let calculating = $state(false);

	// Simple cache to prevent recalculating when nothing changes
	let prevProps = $state('');

	// Update the props string for comparison
	function getPropsString() {
		return `${text}_${width}_${height}_${maxFontSize}_${minFontSize}_${paddingX}_${paddingY}_${maxLines}_${bold}_${italic}`;
	}

	// Calculate the optimal font size
	function calculateOptimalFontSize() {
		if (!textElement || calculating) return;

		// Check if props have changed
		const newPropsString = getPropsString();
		if (newPropsString === prevProps) return;
		prevProps = newPropsString;

		calculating = true;

		try {
			// Reset to max size first
			currentFontSize = maxFontSize;
			textElement.style.fontSize = `${currentFontSize}px`;

			// Get available space (accounting for padding)
			const availableWidth = width - paddingX * 2;
			const availableHeight = height - paddingY * 2;

			// Check if text overflows at max size
			while (
				currentFontSize > minFontSize &&
				(textElement.scrollHeight > availableHeight || textElement.scrollWidth > availableWidth)
			) {
				// Reduce font size by 1px and check again
				currentFontSize -= 1;
				textElement.style.fontSize = `${currentFontSize}px`;
			}

			// Update line-height based on font size to improve vertical alignment
			textElement.style.lineHeight = `${Math.min(currentFontSize * 1.2, height / maxLines)}px`;

			// Cap text at max lines
			const lineHeight = parseFloat(getComputedStyle(textElement).lineHeight);
			const maxHeight = lineHeight * maxLines;

			if (textElement.scrollHeight > maxHeight) {
				textElement.style.maxHeight = `${maxHeight}px`;
				textElement.style.overflow = 'hidden';
			}
		} finally {
			calculating = false;
		}
	}

	// Get alignment classes from props
	function getVerticalClass(align: string): string {
		const classes = {
			top: 'items-start',
			middle: 'items-center',
			bottom: 'items-end'
		};
		return classes[align as keyof typeof classes] || 'items-center';
	}

	function getHorizontalClass(align: string): string {
		const classes = {
			left: 'justify-start text-left',
			center: 'justify-center text-center',
			right: 'justify-end text-right'
		};
		return classes[align as keyof typeof classes] || 'justify-center text-center';
	}

	function getFontClasses(): string {
		return `${bold ? 'font-bold' : ''} ${italic ? 'italic' : ''}`.trim();
	}

	// Debounced calculation
	let timeout: ReturnType<typeof setTimeout> | null = null;
	function debouncedCalculate() {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => {
			if (mounted && textElement) {
				calculateOptimalFontSize();
			}
		}, 10);
	}

	// Calculate font size when component mounts
	onMount(() => {
		mounted = true;
		debouncedCalculate();
	});

	// Track changes to all props and recalculate as needed
	$effect(() => {
		// This creates dependencies on all props without needing to assign to a variable
		void getPropsString();

		if (mounted && textElement) {
			debouncedCalculate();
		}
	});
</script>

<div
	class="flex-text-container {getVerticalClass(alignV)} {getHorizontalClass(alignH)} {className}"
	style="
		width: {width}px;
		height: {height}px;
		padding: {paddingY}px {paddingX}px;
	"
>
	<div
		bind:this={textElement}
		class="flex-text {getFontClasses()}"
		style="
			font-size: {currentFontSize}px;
			color: {color};
		"
	>
		{text}
	</div>
</div>

<style>
	.flex-text-container {
		display: flex;
		overflow: hidden;
		box-sizing: border-box;
	}

	.flex-text {
		width: 100%;
		word-break: break-word;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
