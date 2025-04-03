<script lang="ts">
	import { onMount } from 'svelte';
	// @ts-expect-error No type definitions available for textfit
	import textFit from 'textfit';

	// Dynamic test state
	let dynamicText = 'Edit this text to see dynamic resizing in action!';
	let dynamicWidth = 300;
	let dynamicHeight = 100;
	let dynamicMinFontSize = 6;
	let dynamicMaxFontSize = 80;
	let dynamicAlignHoriz = false;
	let dynamicAlignVert = false;
	let dynamicMultiLine = true;
	let dynamicDetectMultiLine = true;
	let dynamicWidthOnly = false;
	let dynamicAlignVertWithFlexbox = false;
	let dynamicBox: HTMLElement | null = null;
	let dynamicCurrentFontSize = 0;

	// Add a reactive store for font size to ensure UI updates
	import { writable } from 'svelte/store';
	const fontSizeStore = writable(0);
	// Subscribe to updates
	fontSizeStore.subscribe((value) => {
		dynamicCurrentFontSize = value;
	});

	// Debounce variables
	let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
	let updateCount = 0;

	// Function to update font size display
	function updateFontSizeDisplay() {
		if (!dynamicBox) return;

		// TextFit creates an inner span with class "textFitted"
		const innerSpan = dynamicBox.querySelector('.textFitted') as HTMLElement | null;
		if (innerSpan) {
			// Get font size directly from the innerSpan where textFit applies it
			const inlineSize = parseFloat(innerSpan.style.fontSize);
			if (inlineSize > 0) {
				console.log('Reading fontSize from textFitted span:', inlineSize);
				fontSizeStore.set(inlineSize);
				return;
			}
		}

		// Fallback to computed style
		const computedStyle = window.getComputedStyle(dynamicBox);
		const newSize = parseFloat(computedStyle.fontSize);

		// Only update if size actually changed and is valid
		if (newSize > 0 && newSize !== dynamicCurrentFontSize) {
			console.log('Updating font size from', dynamicCurrentFontSize, 'to', newSize);
			fontSizeStore.set(newSize);
		}
	}

	// Initialize the textFit instance
	function initializeTextFit() {
		if (!dynamicBox) return;

		try {
			// Clear any existing styles to avoid conflicts
			dynamicBox.style.fontSize = '';
			dynamicBox.style.display = '';
			dynamicBox.style.whiteSpace = '';

			// Get a unique ID for this update for logging
			const thisUpdateId = ++updateCount;
			console.log(`[${thisUpdateId}] Initializing textFit with options:`, {
				text: dynamicText.substring(0, 20) + (dynamicText.length > 20 ? '...' : ''),
				width: dynamicWidth,
				height: dynamicHeight,
				minFontSize: dynamicMinFontSize,
				maxFontSize: dynamicMaxFontSize,
				multiLine: dynamicMultiLine,
				widthOnly: dynamicWidthOnly
			});

			// Apply textFit with current settings
			textFit(dynamicBox, {
				alignVert: dynamicAlignVert,
				alignHoriz: dynamicAlignHoriz,
				multiLine: dynamicMultiLine,
				detectMultiLine: dynamicDetectMultiLine,
				minFontSize: dynamicMinFontSize,
				maxFontSize: dynamicMaxFontSize,
				widthOnly: dynamicWidthOnly,
				alignVertWithFlexbox: dynamicAlignVertWithFlexbox,
				reProcess: true // Important: always reprocess
			});

			// Set up a MutationObserver to watch for style changes on the innerSpan
			setTimeout(() => {
				const innerSpan = dynamicBox?.querySelector('.textFitted') as HTMLElement | null;
				if (innerSpan) {
					console.log(
						`[${thisUpdateId}] Found innerSpan, current fontSize:`,
						innerSpan.style.fontSize
					);
					// Get size directly from the element where textFit applies it
					const size = parseFloat(innerSpan.style.fontSize);
					if (size > 0) {
						console.log(`[${thisUpdateId}] Setting fontSize from innerSpan:`, size);
						fontSizeStore.set(size);
					}
				} else {
					console.log(`[${thisUpdateId}] No innerSpan found`);
				}
			}, 50);
		} catch (error) {
			console.error('Error initializing textFit:', error);
		}
	}

	// Update function to trigger a fit with debouncing
	function updateTextFit(fullReset = false) {
		if (!dynamicBox) return;

		// Cancel previous timeout
		if (resizeTimeout) {
			clearTimeout(resizeTimeout);
		}

		// For options that require a complete reset, clear all previous styles first
		if (fullReset) {
			if (dynamicBox) {
				// Reset all potentially modified styles
				dynamicBox.style.fontSize = '';
				dynamicBox.style.display = '';
				dynamicBox.style.whiteSpace = '';
				dynamicBox.style.textAlign = '';
			}
		}

		// Debounce the fit operation
		resizeTimeout = setTimeout(() => {
			initializeTextFit();
		}, 100);
	}

	// This function is called when the dynamic box element is bound
	function handleDynamicBoxBinding(node: HTMLElement) {
		dynamicBox = node;
		console.log('Dynamic box bound:', dynamicBox);

		// Create mutation observer to detect changes to the DOM
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
					// Check if a textFitted span was added
					if (!dynamicBox) return;
					const innerSpan = dynamicBox.querySelector('.textFitted') as HTMLElement | null;
					if (innerSpan) {
						const size = parseFloat(innerSpan.style.fontSize);
						if (size > 0) {
							console.log('MutationObserver detected font size change:', size);
							fontSizeStore.set(size);
						}
					}
				}
			});
		});

		// Start observing the dynamicBox for DOM changes
		observer.observe(node, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['style']
		});

		// Initial fit after a short delay to ensure the DOM is ready
		setTimeout(() => {
			initializeTextFit();
		}, 100);

		// Return a cleanup function
		return {
			destroy() {
				observer.disconnect();
			}
		};
	}

	// Force UI to update font size (for debugging)
	function forceUpdateFontSize() {
		if (!dynamicBox) return;

		// Try to get size from textFitted span first
		const innerSpan = dynamicBox.querySelector('.textFitted') as HTMLElement | null;
		if (innerSpan) {
			const size = parseFloat(innerSpan.style.fontSize);
			if (size > 0) {
				console.log('Force update - fontSize from innerSpan:', size);
				fontSizeStore.set(size);
				return;
			}
		}

		// Fallback to computed style
		const computedStyle = window.getComputedStyle(dynamicBox);
		const newSize = parseFloat(computedStyle.fontSize);
		fontSizeStore.set(newSize);
		console.log('Force update - fontSize from computed style:', newSize);
	}

	// Basic test cases
	const testCases = [
		{
			id: 1,
			title: 'Short text, small container',
			text: 'Short text',
			width: 100,
			height: 40,
			minFontSize: 6,
			maxFontSize: 50,
			multiLine: false
		},
		{
			id: 2,
			title: 'Medium text, medium container',
			text: 'This is a medium length text that should fit well',
			width: 200,
			height: 80,
			minFontSize: 8,
			maxFontSize: 40,
			multiLine: true
		},
		{
			id: 3,
			title: 'Long text, small container',
			text: 'This is a very long text that should be scaled down to fit in this small container with multiple lines',
			width: 150,
			height: 60,
			minFontSize: 6,
			maxFontSize: 30,
			multiLine: true
		},
		{
			id: 4,
			title: 'Width only mode',
			text: 'This text only fits to width, regardless of height',
			width: 200,
			height: 50,
			minFontSize: 8,
			maxFontSize: 40,
			widthOnly: true
		},
		{
			id: 5,
			title: 'Single line mode',
			text: 'This text will not wrap to multiple lines',
			width: 180,
			height: 40,
			minFontSize: 6,
			maxFontSize: 30,
			multiLine: false
		},
		{
			id: 6,
			title: 'Centered horizontally and vertically',
			text: 'This text is centered in both directions',
			width: 200,
			height: 100,
			minFontSize: 10,
			maxFontSize: 40,
			alignHoriz: true,
			alignVert: true
		},
		{
			id: 7,
			title: 'Flexbox vertical alignment',
			text: 'This text uses flexbox for better vertical centering',
			width: 200,
			height: 100,
			minFontSize: 10,
			maxFontSize: 40,
			alignHoriz: true,
			alignVert: true,
			alignVertWithFlexbox: true
		}
	];

	onMount(() => {
		// Initialize test cases
		const testElements = document.querySelectorAll<HTMLElement>('.test-textfit');
		console.log(`Found ${testElements.length} test case elements`);

		Array.from(testElements).forEach((element, index) => {
			const test = testCases[index];

			// Apply textFit with test case settings
			textFit(element, {
				alignVert: test.alignVert || false,
				alignHoriz: test.alignHoriz || false,
				multiLine: test.multiLine,
				minFontSize: test.minFontSize,
				maxFontSize: test.maxFontSize,
				widthOnly: test.widthOnly || false,
				alignVertWithFlexbox: test.alignVertWithFlexbox || false
			});
		});

		// Basic test
		const basicTest = document.querySelector<HTMLElement>('.basic-test');
		if (basicTest) {
			textFit(basicTest);
		}

		return () => {
			// Clean up
			if (resizeTimeout) {
				clearTimeout(resizeTimeout);
			}
		};
	});

	// Handler functions for form controls
	function handleTextChange(e: Event) {
		const target = e.target as HTMLTextAreaElement;
		dynamicText = target.value;
		updateTextFit();
	}

	function handleWidthChange(e: Event) {
		const target = e.target as HTMLInputElement;
		dynamicWidth = parseInt(target.value, 10);
		updateTextFit();
	}

	function handleHeightChange(e: Event) {
		const target = e.target as HTMLInputElement;
		dynamicHeight = parseInt(target.value, 10);
		updateTextFit();
	}

	function handleMinFontSizeChange(e: Event) {
		const target = e.target as HTMLInputElement;
		dynamicMinFontSize = parseInt(target.value, 10);
		updateTextFit();
	}

	function handleMaxFontSizeChange(e: Event) {
		const target = e.target as HTMLInputElement;
		dynamicMaxFontSize = parseInt(target.value, 10);
		updateTextFit();
	}

	function handleAlignHorizChange(e: Event) {
		const target = e.target as HTMLInputElement;
		dynamicAlignHoriz = target.checked;
		updateTextFit(true);
	}

	function handleAlignVertChange(e: Event) {
		const target = e.target as HTMLInputElement;
		dynamicAlignVert = target.checked;
		updateTextFit(true);
	}

	function handleMultiLineChange(e: Event) {
		const target = e.target as HTMLInputElement;
		dynamicMultiLine = target.checked;
		// This is a critical setting that needs full reset
		updateTextFit(true);
	}

	function handleDetectMultiLineChange(e: Event) {
		const target = e.target as HTMLInputElement;
		dynamicDetectMultiLine = target.checked;
		updateTextFit(true);
	}

	function handleWidthOnlyChange(e: Event) {
		const target = e.target as HTMLInputElement;
		dynamicWidthOnly = target.checked;
		// This is a critical setting that needs full reset
		updateTextFit(true);
	}

	function handleAlignVertWithFlexboxChange(e: Event) {
		const target = e.target as HTMLInputElement;
		dynamicAlignVertWithFlexbox = target.checked;
		updateTextFit(true);
	}

	function forceFit() {
		// Force a complete re-initialization
		if (dynamicBox) {
			// Reset all styling
			dynamicBox.style.fontSize = '';
			dynamicBox.style.display = '';
			dynamicBox.style.whiteSpace = '';
			dynamicBox.style.textAlign = '';
		}
		initializeTextFit();

		// Force an update of the font size display
		setTimeout(forceUpdateFontSize, 150);
	}
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">TextFit Component Test Page</h1>

	<!-- Dynamic Interactive Test -->
	<div class="mb-8 rounded border p-4">
		<h2 class="mb-2 text-xl">Interactive Test</h2>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<!-- Controls -->
			<div class="space-y-4">
				<div class="form-control">
					<label class="label font-semibold" for="dynamic-text">Text Content</label>
					<textarea
						id="dynamic-text"
						class="textarea textarea-bordered h-24"
						value={dynamicText}
						on:input={handleTextChange}
					></textarea>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div class="form-control">
						<label class="label" for="dynamic-width">Width (px)</label>
						<input
							id="dynamic-width"
							type="range"
							min="50"
							max="500"
							value={dynamicWidth}
							on:input={handleWidthChange}
						/>
						<div class="text-center">{dynamicWidth}px</div>
					</div>

					<div class="form-control">
						<label class="label" for="dynamic-height">Height (px)</label>
						<input
							id="dynamic-height"
							type="range"
							min="30"
							max="300"
							value={dynamicHeight}
							on:input={handleHeightChange}
						/>
						<div class="text-center">{dynamicHeight}px</div>
					</div>

					<div class="form-control">
						<label class="label" for="dynamic-min-font-size">Min Font Size (px)</label>
						<input
							id="dynamic-min-font-size"
							type="range"
							min="4"
							max="40"
							value={dynamicMinFontSize}
							on:input={handleMinFontSizeChange}
						/>
						<div class="text-center">{dynamicMinFontSize}px</div>
					</div>

					<div class="form-control">
						<label class="label" for="dynamic-max-font-size">Max Font Size (px)</label>
						<input
							id="dynamic-max-font-size"
							type="range"
							min="20"
							max="120"
							value={dynamicMaxFontSize}
							on:input={handleMaxFontSizeChange}
						/>
						<div class="text-center">{dynamicMaxFontSize}px</div>
					</div>

					<div class="form-control">
						<label class="label cursor-pointer justify-start gap-2">
							<input
								type="checkbox"
								class="checkbox"
								checked={dynamicAlignHoriz}
								on:change={handleAlignHorizChange}
							/>
							<span class="label-text">Align Horizontally</span>
						</label>
					</div>

					<div class="form-control">
						<label class="label cursor-pointer justify-start gap-2">
							<input
								type="checkbox"
								class="checkbox"
								checked={dynamicAlignVert}
								on:change={handleAlignVertChange}
							/>
							<span class="label-text">Align Vertically</span>
						</label>
					</div>

					<div class="form-control">
						<label class="label cursor-pointer justify-start gap-2">
							<input
								type="checkbox"
								class="checkbox"
								checked={dynamicMultiLine}
								on:change={handleMultiLineChange}
							/>
							<span class="label-text">Multi-line</span>
						</label>
					</div>

					<div class="form-control">
						<label class="label cursor-pointer justify-start gap-2">
							<input
								type="checkbox"
								class="checkbox"
								checked={dynamicDetectMultiLine}
								on:change={handleDetectMultiLineChange}
							/>
							<span class="label-text">Auto-detect Multi-line</span>
						</label>
					</div>

					<div class="form-control">
						<label class="label cursor-pointer justify-start gap-2">
							<input
								type="checkbox"
								class="checkbox"
								checked={dynamicWidthOnly}
								on:change={handleWidthOnlyChange}
							/>
							<span class="label-text">Width-only Mode</span>
						</label>
					</div>

					<div class="form-control">
						<label class="label cursor-pointer justify-start gap-2">
							<input
								type="checkbox"
								class="checkbox"
								checked={dynamicAlignVertWithFlexbox}
								on:change={handleAlignVertWithFlexboxChange}
							/>
							<span class="label-text">Align Vert (Flexbox)</span>
						</label>
					</div>
				</div>

				<div class="flex gap-2">
					<button class="btn btn-primary" on:click={forceFit}>Force Fit</button>
					<button class="btn" on:click={forceUpdateFontSize}>Update Font Size</button>
				</div>
			</div>

			<!-- Preview -->
			<div class="flex flex-col items-center justify-center">
				<div
					class="border-primary flex items-center justify-center rounded border-2 border-dashed"
					style="width: {dynamicWidth}px; height: {dynamicHeight}px;"
				>
					<div
						use:handleDynamicBoxBinding
						class="textfit-element h-full w-full"
						style={`
							${dynamicAlignHoriz ? 'text-align: center;' : ''}
							${dynamicAlignVert && dynamicAlignVertWithFlexbox ? 'display: flex; justify-content: center; align-items: center;' : ''}
						`}
					>
						{dynamicText}
					</div>
				</div>
				<div class="mt-2 text-sm">
					Container: {dynamicWidth}px × {dynamicHeight}px
					{#if dynamicWidthOnly}
						<span class="ml-2 text-xs font-medium text-blue-500">(Width-only mode)</span>
					{/if}
					{#if !dynamicMultiLine}
						<span class="ml-2 text-xs font-medium text-orange-500">(Single-line)</span>
					{/if}
				</div>
				<div class="mt-1 text-sm font-medium text-purple-600">
					Calculated Font Size: {dynamicCurrentFontSize.toFixed(2)}px
				</div>
			</div>
		</div>
	</div>

	<!-- Basic Test -->
	<div class="mb-8 rounded border p-4">
		<h2 class="mb-2 text-xl">Basic Test</h2>
		<div style="border: 1px dashed #999; width: 200px; height: 100px; position: relative;">
			<div class="basic-test" style="width: 100%; height: 100%;">
				Basic test to verify TextFit is working
			</div>
		</div>
	</div>

	<!-- Test Cases -->
	<div class="mb-8 rounded border p-4">
		<h2 class="mb-2 text-xl">Test Cases</h2>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			{#each testCases as test (test.id)}
				<div class="border p-2">
					<h3 class="text-sm font-bold">{test.title}</h3>
					<div
						style={`border: 1px dashed #999; width: ${test.width}px; height: ${test.height}px; position: relative;`}
					>
						<div
							class="test-textfit"
							style={`
								width: 100%; 
								height: 100%;
								${test.alignHoriz ? 'text-align: center;' : ''}
								${test.alignVert && test.alignVertWithFlexbox ? 'display: flex; justify-content: center; align-items: center;' : ''}
							`}
						>
							{test.text}
						</div>
					</div>
					<div class="mt-1 text-xs">
						Size: {test.width}×{test.height}px Min: {test.minFontSize}px, Max: {test.maxFontSize}px
						{#if test.widthOnly}
							<span class="ml-1">(Width-only)</span>
						{/if}
						{#if test.multiLine === false}
							<span class="ml-1">(Single-line)</span>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- API Information -->
	<div class="mb-8 rounded border p-4">
		<h2 class="mb-2 text-xl">TextFit Options</h2>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<div class="border p-2">
				<h3 class="text-sm font-bold">Default Settings</h3>
				<pre class="mt-2 text-xs whitespace-pre-wrap">
{`{
    alignVert: false, // if true, vertically aligns text using CSS tables
    alignHoriz: false, // if true, sets text-align: center
    multiLine: false, // if true, doesn't set white-space: no-wrap
    detectMultiLine: true, // auto-detect multi-line text
    minFontSize: 6,
    maxFontSize: 80,
    reProcess: true, // re-processes elements already processed
    widthOnly: false, // fit to width only, ignoring height
    alignVertWithFlexbox: false, // use flexbox for vertical alignment
}`}
				</pre>
			</div>
			<div class="border p-2">
				<h3 class="text-sm font-bold">Features</h3>
				<ul class="list-disc pl-5">
					<li>Fast binary search algorithm - most fits complete in &lt;1ms</li>
					<li>Supports both horizontal and vertical centering</li>
					<li>Supports padding, multiple fonts, and multiline text</li>
					<li>No dependencies - small size (1.5KB gzipped)</li>
					<li>Supports IE9+ and all modern browsers</li>
				</ul>
			</div>
		</div>
	</div>
</div>
