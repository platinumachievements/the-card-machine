<script lang="ts">
	import { onMount } from 'svelte';
	import { TextFit } from '$lib';
	import { textFit } from '$lib/actions/textFit';

	// Dynamic test state
	let dynamicText = $state('Edit this text to see dynamic resizing in action!');
	let dynamicWidth = $state(300);
	let dynamicHeight = $state(100);
	let dynamicMinFontSize = $state(6);
	let dynamicMaxFontSize = $state(80);
	let dynamicMode = $state<'single' | 'multi'>('multi');
	let dynamicAlignHoriz = $state<'left' | 'center' | 'right'>('center');
	let dynamicAlignVert = $state<'top' | 'middle' | 'bottom'>('middle');
	let dynamicWidthOnly = $state(false);
	let dynamicUseFlexbox = $state(true);
	let dynamicPaddingX = $state(4);
	let dynamicPaddingY = $state(2);
	let dynamicBold = $state(false);
	let dynamicItalic = $state(false);
	let dynamicCurrentFontSize = $state(0);

	// Initialize the component version
	onMount(() => {
		console.log('TextFit component and action initialized');
	});

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
			mode: 'single' as const
		},
		{
			id: 2,
			title: 'Medium text, medium container',
			text: 'This is a medium length text that should fit well',
			width: 200,
			height: 80,
			minFontSize: 8,
			maxFontSize: 40,
			mode: 'multi' as const
		},
		{
			id: 3,
			title: 'Long text, small container',
			text: 'This is a very long text that should be scaled down to fit in this small container with multiple lines',
			width: 150,
			height: 60,
			minFontSize: 6,
			maxFontSize: 30,
			mode: 'multi' as const
		},
		{
			id: 4,
			title: 'Width only mode',
			text: 'This text only fits to width, regardless of height',
			width: 200,
			height: 50,
			minFontSize: 8,
			maxFontSize: 40,
			widthOnly: true,
			mode: 'multi' as const
		},
		{
			id: 5,
			title: 'Horizontal and vertical alignment',
			text: 'Centered text with flex alignment',
			width: 200,
			height: 100,
			minFontSize: 10,
			maxFontSize: 30,
			alignHoriz: 'center' as const,
			alignVert: 'middle' as const,
			mode: 'multi' as const
		}
	];
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">TextFit Test Page</h1>
	<p class="mb-8">This page demonstrates our custom Svelte 5 implementation of TextFit.</p>

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
						oninput={(e) => (dynamicText = e.currentTarget.value)}
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
							oninput={(e) => (dynamicWidth = parseInt(e.currentTarget.value))}
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
							oninput={(e) => (dynamicHeight = parseInt(e.currentTarget.value))}
						/>
						<div class="text-center">{dynamicHeight}px</div>
					</div>

					<div class="form-control">
						<label class="label" for="dynamic-min-font-size">Min Font Size (px)</label>
						<input
							id="dynamic-min-font-size"
							type="range"
							min="4"
							max="24"
							value={dynamicMinFontSize}
							oninput={(e) => (dynamicMinFontSize = parseInt(e.currentTarget.value))}
						/>
						<div class="text-center">{dynamicMinFontSize}px</div>
					</div>

					<div class="form-control">
						<label class="label" for="dynamic-max-font-size">Max Font Size (px)</label>
						<input
							id="dynamic-max-font-size"
							type="range"
							min="24"
							max="120"
							value={dynamicMaxFontSize}
							oninput={(e) => (dynamicMaxFontSize = parseInt(e.currentTarget.value))}
						/>
						<div class="text-center">{dynamicMaxFontSize}px</div>
					</div>

					<div class="form-control">
						<label class="label" for="dynamic-padding-x">Padding X (px)</label>
						<input
							id="dynamic-padding-x"
							type="range"
							min="0"
							max="20"
							value={dynamicPaddingX}
							oninput={(e) => (dynamicPaddingX = parseInt(e.currentTarget.value))}
						/>
						<div class="text-center">{dynamicPaddingX}px</div>
					</div>

					<div class="form-control">
						<label class="label" for="dynamic-padding-y">Padding Y (px)</label>
						<input
							id="dynamic-padding-y"
							type="range"
							min="0"
							max="20"
							value={dynamicPaddingY}
							oninput={(e) => (dynamicPaddingY = parseInt(e.currentTarget.value))}
						/>
						<div class="text-center">{dynamicPaddingY}px</div>
					</div>

					<div class="form-control">
						<label class="label" for="dynamic-mode">Text Mode</label>
						<select
							id="dynamic-mode"
							class="select select-bordered w-full"
							value={dynamicMode}
							onchange={(e) => (dynamicMode = e.currentTarget.value as 'single' | 'multi')}
						>
							<option value="single">Single Line</option>
							<option value="multi">Multi Line</option>
						</select>
					</div>

					<div class="form-control">
						<label class="label" for="dynamic-align-horiz">Horizontal Alignment</label>
						<select
							id="dynamic-align-horiz"
							class="select select-bordered w-full"
							value={dynamicAlignHoriz}
							onchange={(e) =>
								(dynamicAlignHoriz = e.currentTarget.value as 'left' | 'center' | 'right')}
						>
							<option value="left">Left</option>
							<option value="center">Center</option>
							<option value="right">Right</option>
						</select>
					</div>

					<div class="form-control">
						<label class="label" for="dynamic-align-vert">Vertical Alignment</label>
						<select
							id="dynamic-align-vert"
							class="select select-bordered w-full"
							value={dynamicAlignVert}
							onchange={(e) =>
								(dynamicAlignVert = e.currentTarget.value as 'top' | 'middle' | 'bottom')}
						>
							<option value="top">Top</option>
							<option value="middle">Middle</option>
							<option value="bottom">Bottom</option>
						</select>
					</div>

					<div class="form-control">
						<label class="label cursor-pointer justify-start gap-2" for="dynamic-bold">
							<input
								id="dynamic-bold"
								type="checkbox"
								class="checkbox"
								checked={dynamicBold}
								onchange={(e) => (dynamicBold = e.currentTarget.checked)}
							/>
							<span class="label-text">Bold</span>
						</label>
					</div>

					<div class="form-control">
						<label class="label cursor-pointer justify-start gap-2" for="dynamic-italic">
							<input
								id="dynamic-italic"
								type="checkbox"
								class="checkbox"
								checked={dynamicItalic}
								onchange={(e) => (dynamicItalic = e.currentTarget.checked)}
							/>
							<span class="label-text">Italic</span>
						</label>
					</div>

					<div class="form-control">
						<label class="label cursor-pointer justify-start gap-2" for="dynamic-width-only">
							<input
								id="dynamic-width-only"
								type="checkbox"
								class="checkbox"
								checked={dynamicWidthOnly}
								onchange={(e) => (dynamicWidthOnly = e.currentTarget.checked)}
							/>
							<span class="label-text">Width Only</span>
						</label>
					</div>

					<div class="form-control">
						<label class="label cursor-pointer justify-start gap-2" for="dynamic-use-flexbox">
							<input
								id="dynamic-use-flexbox"
								type="checkbox"
								class="checkbox"
								checked={dynamicUseFlexbox}
								onchange={(e) => (dynamicUseFlexbox = e.currentTarget.checked)}
							/>
							<span class="label-text">Use Flexbox</span>
						</label>
					</div>
				</div>
			</div>

			<!-- Preview -->
			<div class="flex flex-col items-center justify-center">
				<div class="mb-8">
					<h3 class="mb-4 text-lg font-semibold">Component Implementation</h3>
					<div
						class="border-primary rounded border-2 border-dashed"
						style="width: {dynamicWidth}px; height: {dynamicHeight}px;"
					>
						<TextFit
							text={dynamicText}
							width={dynamicWidth}
							height={dynamicHeight}
							minFontSize={dynamicMinFontSize}
							maxFontSize={dynamicMaxFontSize}
							mode={dynamicMode}
							alignHoriz={dynamicAlignHoriz}
							alignVert={dynamicAlignVert}
							paddingX={dynamicPaddingX}
							paddingY={dynamicPaddingY}
							widthOnly={dynamicWidthOnly}
							useFlexbox={dynamicUseFlexbox}
							bold={dynamicBold}
							italic={dynamicItalic}
							bind:currentFontSize={dynamicCurrentFontSize}
						/>
					</div>
					<div class="mt-1 text-sm font-medium text-purple-600">
						Calculated Font Size: {dynamicCurrentFontSize.toFixed(1)}px
					</div>
				</div>

				<div>
					<h3 class="mb-4 text-lg font-semibold">Action Implementation</h3>
					<div
						class="border-secondary rounded border-2 border-dashed"
						style="width: {dynamicWidth}px; height: {dynamicHeight}px;"
					>
						<div
							class="flex h-full w-full text-center"
							use:textFit={{
								text: dynamicText,
								minFontSize: dynamicMinFontSize,
								maxFontSize: dynamicMaxFontSize,
								mode: dynamicMode,
								alignHoriz: dynamicAlignHoriz,
								alignVert: dynamicAlignVert,
								widthOnly: dynamicWidthOnly,
								paddingX: dynamicPaddingX,
								paddingY: dynamicPaddingY
							}}
						>
							{dynamicText}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Test Cases -->
	<div class="mb-8 rounded border p-4">
		<h2 class="mb-4 text-xl">Test Cases</h2>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each testCases as test (test.id)}
				<div class="card bg-base-200 shadow-md">
					<div class="card-body p-4">
						<h3 class="card-title text-base">{test.title}</h3>
						<div class="mt-2 text-xs text-gray-500">
							{test.width}×{test.height}, {test.minFontSize}-{test.maxFontSize}px
						</div>
						<!-- Component version -->
						<div
							class="border-primary mt-2 rounded border"
							style="width: {test.width}px; height: {test.height}px;"
						>
							<TextFit
								text={test.text}
								width={test.width}
								height={test.height}
								minFontSize={test.minFontSize}
								maxFontSize={test.maxFontSize}
								mode={test.mode}
								alignHoriz={test.alignHoriz ?? 'center'}
								alignVert={test.alignVert ?? 'middle'}
								widthOnly={test.widthOnly}
							/>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Usage Examples -->
	<div class="mb-8 rounded border p-4">
		<h2 class="mb-4 text-xl">Usage Examples</h2>

		<div class="mb-4">
			<h3 class="mb-2 text-lg">Component Usage</h3>
			<pre class="bg-base-300 overflow-x-auto rounded p-4">
{`<TextFit
  text="Your text here"
  width={300}
  height={100}
  minFontSize={6}
  maxFontSize={48}
  mode="multi"
  alignHoriz="center"
  alignVert="middle"
/>`}</pre>
		</div>

		<div class="mb-4">
			<h3 class="mb-2 text-lg">Action Usage</h3>
			<pre class="bg-base-300 overflow-x-auto rounded p-4">
{`<div
  use:textFit={{
    text: "Your text here",
    minFontSize: 6,
    maxFontSize: 48,
    mode: "multi"
  }}
>
  Your text here
</div>`}</pre>
		</div>

		<div>
			<h3 class="mb-2 text-lg">Utility Function Usage</h3>
			<pre class="bg-base-300 overflow-x-auto rounded p-4">
{`// Direct calculation
const result = calculateTextFit(
  element,
  "Your text here",
  300,
  100,
  { maxFontSize: 48 }
);

// Automatic with ResizeObserver
const cleanup = applyTextFit(
  textElement,
  containerElement,
  "Your text here",
  { mode: "multi" }
);`}</pre>
		</div>
	</div>

	<div class="mt-8 text-center">
		<a href="/" class="btn btn-primary">Back to Main Page</a>
	</div>
</div>
