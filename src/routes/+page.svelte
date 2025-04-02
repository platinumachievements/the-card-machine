<script lang="ts">
	import FlexText from '$lib/FlexText.svelte';

	// Position type
	type Position = 'top' | 'center' | 'bottom';

	// Reactive state for selected positions
	let selectedTitlePosition = $state<Position>('top');
	let selectedDescPosition = $state<Position>('bottom');

	// Card data
	const cards = $derived([
		{
			id: 1,
			title: 'Platinum Card',
			description:
				'A rare collectible card with special abilities. Limited edition series with unique design.',
			background: '/background.webp',
			overlay: '/V1.png',
			titlePosition: selectedTitlePosition,
			descriptionPosition: selectedDescPosition
		},
		{
			id: 2,
			title: 'Burnout Paradise',
			description:
				'Speed through Paradise City with this ultimate racing card. Boosts driving skills by 25%.',
			background: '/483-burnout-paradise_background.png',
			overlay: '/483-burnout-paradise_icon.png',
			titlePosition: selectedTitlePosition,
			descriptionPosition: selectedDescPosition
		}
	]);

	// Function to get position classes based on position value
	function getPositionClasses(position: Position): string {
		switch (position) {
			case 'top':
				return 'top-7';
			case 'center':
				return 'top-1/2 -translate-y-1/2';
			case 'bottom':
				return 'bottom-4';
			default:
				return 'center';
		}
	}

	// Update functions
	function updateTitlePosition(e: Event) {
		selectedTitlePosition = (e.target as HTMLSelectElement).value as Position;
	}

	function updateDescPosition(e: Event) {
		selectedDescPosition = (e.target as HTMLSelectElement).value as Position;
	}
</script>

<h1 class="mb-8 text-3xl font-bold">The Card Machine</h1>

<div class="flex flex-wrap justify-center gap-8">
	{#each cards as card (card.id)}
		<!-- Trading Card - using CSS aspect ratio to maintain poker card dimensions (2.5:3.5) -->
		<div
			class="card bg-base-100 relative w-64 overflow-hidden shadow-xl"
			style="aspect-ratio: 5/7;"
		>
			<!-- Background Image -->
			<figure class="absolute inset-0 h-full w-full">
				<img src={card.background} alt="Background" class="h-full w-full object-cover" />
			</figure>

			<!-- Overlay Image -->
			<div class="absolute inset-0 flex items-center justify-center">
				<img src={card.overlay} alt="Overlay" class="max-h-full max-w-full object-contain" />
			</div>

			<!-- Title Text Container -->
			<div
				class="absolute z-10 flex w-full justify-center {getPositionClasses(card.titlePosition)}"
			>
				<FlexText
					text={card.title}
					width={200}
					height={40}
					maxFontSize={24}
					minFontSize={10}
					maxLines={1}
					bold={true}
					color="white"
					className="text-shadow"
				/>
			</div>

			<!-- Description Text Container -->
			<div
				class="absolute z-10 flex w-full justify-center {getPositionClasses(
					card.descriptionPosition
				)}"
			>
				<FlexText
					text={card.description}
					width={200}
					height={60}
					maxFontSize={16}
					minFontSize={8}
					maxLines={3}
					color="white"
					className="text-shadow"
				/>
			</div>

			<!-- Card Border Overlay - gives it a more finished look -->
			<div class="border-primary pointer-events-none absolute inset-0 rounded-lg border-4"></div>
		</div>
	{/each}
</div>

<div class="divider my-12">Card Controls</div>

<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
	<!-- Position Controls -->
	<div class="card bg-base-200 shadow-md">
		<div class="card-body">
			<h2 class="card-title">Text Positioning</h2>
			<div class="form-control">
				<label class="label">Title Position</label>
				<select
					class="select select-bordered w-full"
					value={selectedTitlePosition}
					on:change={updateTitlePosition}
				>
					<option value="top">Top</option>
					<option value="center">Center</option>
					<option value="bottom">Bottom</option>
				</select>
			</div>
			<div class="form-control">
				<label class="label">Description Position</label>
				<select
					class="select select-bordered w-full"
					value={selectedDescPosition}
					on:change={updateDescPosition}
				>
					<option value="top">Top</option>
					<option value="center">Center</option>
					<option value="bottom">Bottom</option>
				</select>
			</div>
		</div>
	</div>

	<!-- Button Controls -->
	<div class="card bg-base-200 shadow-md">
		<div class="card-body">
			<h2 class="card-title">Card Controls</h2>
			<div class="flex flex-wrap gap-2">
				<button class="btn btn-primary">Create Card</button>
				<button class="btn btn-secondary">Edit Card</button>
				<button class="btn btn-accent">Save Collection</button>
				<div class="join w-full">
					<button class="join-item btn flex-1">Previous</button>
					<button class="join-item btn btn-active flex-1">Current</button>
					<button class="join-item btn flex-1">Next</button>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.text-shadow {
		text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.8);
	}
</style>
