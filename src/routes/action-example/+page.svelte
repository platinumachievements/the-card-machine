<script lang="ts">
	import { textFit } from '$lib/actions/textFit';

	let text = $state('This text will fit the container no matter how long it gets!');
	let maxFontSize = $state(48);
	let minFontSize = $state(8);
	let mode = $state<'single' | 'multi'>('multi');

	// Ensure minFontSize never exceeds maxFontSize
	$effect(() => {
		if (minFontSize > maxFontSize) {
			minFontSize = maxFontSize;
		}
	});
</script>

<h1 class="mb-8 text-3xl font-bold">TextFit Action Example</h1>

<div class="mb-8 space-y-4">
	<div class="form-control">
		<label class="label" for="text-content">Text Content</label>
		<input
			id="text-content"
			type="text"
			class="input input-bordered w-full"
			value={text}
			oninput={(e) => (text = e.currentTarget.value)}
		/>
	</div>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
		<div class="form-control">
			<label class="label" for="min-font-size">Min Font Size: {minFontSize}px</label>
			<input
				id="min-font-size"
				type="range"
				min="4"
				max="24"
				class="range"
				value={minFontSize}
				oninput={(e) => (minFontSize = parseInt(e.currentTarget.value))}
			/>
		</div>

		<div class="form-control">
			<label class="label" for="max-font-size">Max Font Size: {maxFontSize}px</label>
			<input
				id="max-font-size"
				type="range"
				min="24"
				max="100"
				class="range"
				value={maxFontSize}
				oninput={(e) => (maxFontSize = parseInt(e.currentTarget.value))}
			/>
		</div>

		<div class="form-control">
			<label class="label" for="text-mode">Mode</label>
			<select
				id="text-mode"
				class="select select-bordered w-full"
				value={mode}
				onchange={(e) => (mode = e.currentTarget.value as 'single' | 'multi')}
			>
				<option value="single">Single Line</option>
				<option value="multi">Multi Line</option>
			</select>
		</div>
	</div>
</div>

<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
	<!-- Example 1: Basic usage -->
	<div class="card bg-base-200 shadow-md">
		<div class="card-body">
			<h2 class="card-title">Basic Usage</h2>
			<div
				class="bg-base-100 flex h-40 items-center justify-center rounded p-4 text-center"
				use:textFit={{
					text,
					minFontSize,
					maxFontSize,
					mode,
					paddingX: 8,
					paddingY: 8
				}}
			>
				{text}
			</div>
		</div>
	</div>

	<!-- Example 2: Styled usage -->
	<div class="card bg-base-200 shadow-md">
		<div class="card-body">
			<h2 class="card-title">Styled Usage</h2>
			<div
				class="bg-accent text-accent-content flex h-40 items-center justify-center rounded p-4 text-center"
				use:textFit={{
					text,
					minFontSize,
					maxFontSize,
					mode,
					paddingX: 16,
					paddingY: 16
				}}
			>
				{text}
			</div>
		</div>
	</div>

	<!-- Example 3: Card-like usage -->
	<div class="card bg-base-200 shadow-md">
		<div class="card-body">
			<h2 class="card-title">Card Example</h2>
			<div class="bg-primary relative h-60 overflow-hidden rounded">
				<!-- Background pattern -->
				<div class="absolute inset-0 opacity-20">
					<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
						<defs>
							<pattern
								id="pattern"
								patternUnits="userSpaceOnUse"
								width="20"
								height="20"
								patternTransform="rotate(45)"
							>
								<rect width="2" height="2" fill="currentColor" />
							</pattern>
						</defs>
						<rect width="100%" height="100%" fill="url(#pattern)" />
					</svg>
				</div>

				<!-- Title -->
				<div class="absolute top-6 right-0 left-0 z-10 px-4">
					<div
						class="text-primary-content text-center font-bold"
						use:textFit={{
							text: 'PREMIUM CARD',
							minFontSize: 16,
							maxFontSize: 32,
							mode: 'single'
						}}
					>
						PREMIUM CARD
					</div>
				</div>

				<!-- Main content -->
				<div class="absolute inset-0 flex items-center justify-center p-8">
					<div
						class="text-primary-content text-center"
						use:textFit={{
							text,
							minFontSize: 12,
							maxFontSize: 24,
							mode: 'multi'
						}}
					>
						{text}
					</div>
				</div>

				<!-- Footer -->
				<div class="absolute right-0 bottom-4 left-0 z-10 px-4">
					<div
						class="text-primary-content text-center opacity-80"
						use:textFit={{
							text: '© 2023 TextFit Example',
							minFontSize: 8,
							maxFontSize: 14,
							mode: 'single'
						}}
					>
						© 2023 TextFit Example
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Example 4: Width-only fitting -->
	<div class="card bg-base-200 shadow-md">
		<div class="card-body">
			<h2 class="card-title">Width-Only Fitting</h2>
			<div class="bg-secondary relative h-60 overflow-hidden rounded">
				<div
					class="text-secondary-content p-4 text-center"
					use:textFit={{
						text,
						minFontSize,
						maxFontSize,
						mode: 'multi',
						widthOnly: true
					}}
				>
					{text}
				</div>
			</div>
		</div>
	</div>
</div>

<div class="mt-8 text-center">
	<a href="/" class="btn btn-primary">Back to Main Page</a>
</div>
