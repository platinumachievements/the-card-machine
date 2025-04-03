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
		alignH = 'center',
		alignV = 'middle',
		maxLines = 3,
		className = '',
		bold = false,
		italic = false,
		color = 'inherit',
		reProcess = true,
		currentFontSize = $bindable(maxFontSize)
	} = $props();

	// Validate props after declaration
	width = Math.max(200, width);
	height = Math.max(40, height);
	maxFontSize = Math.max(24, maxFontSize);
	minFontSize = Math.min(Math.max(8, minFontSize), maxFontSize);

	let textElement: HTMLDivElement;
	let containerElement: HTMLDivElement;
	let mounted = $state(false);
	let calculating = $state(false);
	let processed = $state(false);
	let prevProps = $state('');

	function getPropsString() {
		return `${text}_${width}_${height}_${maxFontSize}_${minFontSize}_${maxLines}`;
	}

	function calculateOptimalFontSize() {
		if (!textElement || calculating) return;

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
			textElement.style.maxHeight = '';
			textElement.style.overflow = '';

			// Text can always wrap
			textElement.style.whiteSpace = 'normal';
			textElement.style.textOverflow = 'clip';

			const availableWidth = width - paddingX * 2;
			const availableHeight = height - paddingY * 2;
			const lineHeightRatio = 1.3;
			const tolerance = 1; // Allow 1px tolerance for rendering quirks

			let low = minFontSize;
			let high = maxFontSize;
			let optimalFontSize = minFontSize;

			const isFontSizeValid = (fontSize: number): boolean => {
				textElement.style.fontSize = `${fontSize}px`;
				const lineHeight = Math.max(fontSize * lineHeightRatio, 1);
				textElement.style.lineHeight = `${lineHeight}px`;

				const scrollWidth = textElement.scrollWidth;
				const scrollHeight = textElement.scrollHeight;
				const maxHeightForLines = lineHeight * maxLines;

				if (scrollWidth > availableWidth) return false;

				// Add tolerance to height check
				return scrollHeight <= Math.min(maxHeightForLines, availableHeight) + tolerance;
			};

			// Binary search with explicit tracking of largest valid size
			while (low <= high) {
				const mid = Math.floor((low + high) / 2);
				if (isFontSizeValid(mid)) {
					optimalFontSize = mid;
					low = mid + 1; // Try larger
				} else {
					high = mid - 1; // Try smaller
				}
			}

			// Apply the optimal size
			if (!processed || reProcess) {
				currentFontSize = optimalFontSize;
			}
			textElement.style.fontSize = `${currentFontSize}px`;
			const finalLineHeight = Math.max(currentFontSize * lineHeightRatio, 1);
			textElement.style.lineHeight = `${finalLineHeight}px`;

			const maxHeight = finalLineHeight * maxLines;
			textElement.style.maxHeight = `${maxHeight}px`;
			textElement.style.overflow = 'hidden';

			processed = true;
		} finally {
			calculating = false;
		}
	}

	// Alignment class helpers
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
			width: {width - 2 * paddingX}px;
			max-height: {height - 2 * paddingY}px;
			box-sizing: border-box;
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
		word-break: break-word;
		overflow: hidden;
		/* background-color: rgba(255, 0, 0, 0.1); /* Temporary for debugging */
	}
</style>
