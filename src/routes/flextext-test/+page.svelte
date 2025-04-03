<script lang="ts">
	import FlexText from '$lib/FlexText.svelte';

	// Dynamic test state
	let dynamicText = 'Edit this text to see dynamic resizing in action!';
	let dynamicWidth = 300;
	let dynamicHeight = 100;
	let dynamicMaxFontSize = 36;
	let dynamicMinFontSize = 8;
	let dynamicPaddingX = 8;
	let dynamicPaddingY = 4;
	let dynamicMaxLines = 3;
	let dynamicBold = false;
	let dynamicItalic = false;
	let dynamicAlignH = 'center';
	let dynamicAlignV = 'middle';
	let dynamicReProcess = true;
	let dynamicCurrentFontSize = dynamicMaxFontSize; // Initialize to maxFontSize

	// Ensure minFontSize <= maxFontSize
	$: if (dynamicMinFontSize > dynamicMaxFontSize) {
		dynamicMinFontSize = dynamicMaxFontSize;
	}

	// Basic test cases
	const testCases = [
		{
			id: 1,
			title: 'Short text, small container',
			text: 'Short text',
			width: 100,
			height: 40,
			maxFontSize: 24,
			minFontSize: 8
		},
		{
			id: 2,
			title: 'Medium text, medium container',
			text: 'This is a medium length text that should fit well',
			width: 200,
			height: 80,
			maxFontSize: 20,
			minFontSize: 10
		},
		{
			id: 3,
			title: 'Long text, small container',
			text: 'This is a very long text that should be scaled down to fit in this small container with multiple lines',
			width: 150,
			height: 60,
			maxFontSize: 18,
			minFontSize: 6
		},
		{
			id: 6,
			title: 'Large font test: 64px',
			text: 'This text should fit in 3 lines with a large font',
			width: 492,
			height: 300,
			maxFontSize: 64,
			minFontSize: 8,
			maxLines: 3
		},
		{
			id: 7,
			title: 'Large font test: 65px',
			text: 'This text should fit in 3 lines with a large font',
			width: 492,
			height: 300,
			maxFontSize: 65,
			minFontSize: 8,
			maxLines: 3
		}
	];
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">FlexText Component Test Page</h1>

	<!-- Dynamic Interactive Test -->
	<div class="mb-8 rounded border p-4">
		<h2 class="mb-2 text-xl">Interactive Test</h2>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<!-- Controls -->
			<div class="space-y-4">
				<div class="form-control">
					<label class="label font-semibold">Text Content</label>
					<textarea class="textarea textarea-bordered h-24" bind:value={dynamicText}></textarea>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div class="form-control">
						<label class="label">Width (px)</label>
						<input type="range" min="50" max="500" bind:value={dynamicWidth} />
						<div class="text-center">{dynamicWidth}px</div>
					</div>

					<div class="form-control">
						<label class="label">Height (px)</label>
						<input type="range" min="30" max="300" bind:value={dynamicHeight} />
						<div class="text-center">{dynamicHeight}px</div>
					</div>

					<div class="form-control">
						<label class="label">Max Font Size (px)</label>
						<input type="range" min="12" max="72" bind:value={dynamicMaxFontSize} />
						<div class="text-center">{dynamicMaxFontSize}px</div>
					</div>

					<div class="form-control">
						<label class="label">Min Font Size (px)</label>
						<input type="range" min="4" max="24" bind:value={dynamicMinFontSize} />
						<div class="text-center">{dynamicMinFontSize}px</div>
					</div>

					<div class="form-control">
						<label class="label">Padding X (px)</label>
						<input type="range" min="0" max="20" bind:value={dynamicPaddingX} />
						<div class="text-center">{dynamicPaddingX}px</div>
					</div>

					<div class="form-control">
						<label class="label">Padding Y (px)</label>
						<input type="range" min="0" max="20" bind:value={dynamicPaddingY} />
						<div class="text-center">{dynamicPaddingY}px</div>
					</div>

					<div class="form-control">
						<label class="label">Max Lines</label>
						<input type="range" min="1" max="10" step="1" bind:value={dynamicMaxLines} />
						<div class="text-center">{dynamicMaxLines}</div>
					</div>

					<div class="form-control">
						<label class="label">Horizontal Alignment</label>
						<select class="select select-bordered w-full" bind:value={dynamicAlignH}>
							<option value="left">Left</option>
							<option value="center">Center</option>
							<option value="right">Right</option>
						</select>
					</div>

					<div class="form-control">
						<label class="label">Vertical Alignment</label>
						<select class="select select-bordered w-full" bind:value={dynamicAlignV}>
							<option value="top">Top</option>
							<option value="middle">Middle</option>
							<option value="bottom">Bottom</option>
						</select>
					</div>

					<div class="form-control">
						<label class="label cursor-pointer justify-start gap-2">
							<input type="checkbox" class="checkbox" bind:checked={dynamicBold} />
							<span class="label-text">Bold</span>
						</label>
					</div>

					<div class="form-control">
						<label class="label cursor-pointer justify-start gap-2">
							<input type="checkbox" class="checkbox" bind:checked={dynamicItalic} />
							<span class="label-text">Italic</span>
						</label>
					</div>

					<div class="form-control">
						<label class="label cursor-pointer justify-start gap-2">
							<input type="checkbox" class="checkbox" bind:checked={dynamicReProcess} />
							<span class="label-text">Re-process on Change</span>
						</label>
					</div>
				</div>
			</div>

			<!-- Preview -->
			<div class="flex flex-col items-center justify-center">
				<div
					class="border-primary rounded border-2 border-dashed"
					style="width: {dynamicWidth}px; height: {dynamicHeight}px;"
				>
					<FlexText
						text={dynamicText}
						width={dynamicWidth}
						height={dynamicHeight}
						maxFontSize={dynamicMaxFontSize}
						minFontSize={dynamicMinFontSize}
						paddingX={dynamicPaddingX}
						paddingY={dynamicPaddingY}
						maxLines={dynamicMaxLines}
						alignH={dynamicAlignH}
						alignV={dynamicAlignV}
						bold={dynamicBold}
						italic={dynamicItalic}
						reProcess={dynamicReProcess}
						bind:currentFontSize={dynamicCurrentFontSize}
					/>
				</div>
				<div class="mt-2 text-sm">
					Container: {dynamicWidth}px × {dynamicHeight}px
				</div>
				<div class="mt-1 text-sm font-medium text-purple-600">
					Calculated Font Size: {dynamicCurrentFontSize}px
				</div>
			</div>
		</div>
	</div>

	<!-- Basic Test -->
	<div class="mb-8 rounded border p-4">
		<h2 class="mb-2 text-xl">Basic Test</h2>
		<div style="border: 1px dashed #999; width: 200px; height: 100px; position: relative;">
			<FlexText
				text="Basic test to verify FlexText is working"
				width={200}
				height={100}
				maxFontSize={20}
				minFontSize={10}
				paddingX={4}
				paddingY={2}
			/>
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
						<FlexText
							text={test.text}
							width={test.width}
							height={test.height}
							maxFontSize={test.maxFontSize}
							minFontSize={test.minFontSize}
							maxLines={test.maxLines ?? 3}
							paddingX={4}
							paddingY={2}
						/>
					</div>
					<div class="mt-1 text-xs">
						Size: {test.width}×{test.height}px
						{#if test.maxLines}
							<span class="ml-1">({test.maxLines} lines)</span>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
