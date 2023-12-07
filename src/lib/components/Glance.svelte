<script lang="ts">
	import Paw from '$lib/icons/Paw.svelte';
	import Sun from '$lib/icons/Sun.svelte';

	export let maxTemperature: number;
	export let maxUvIndex: number;

	type SafetyRating = 'safe' | 'warning' | 'danger' | 'extreme';

	let dogRating: SafetyRating = 'safe';
	let uvRating: SafetyRating = 'safe';

	switch (true) {
		case maxTemperature < 20:
			dogRating = 'safe';
			break;
		case maxTemperature < 25:
			dogRating = 'warning';
			break;
		case maxTemperature < 30:
			dogRating = 'danger';
			break;
		default:
			dogRating = 'extreme';
			break;
	}

	switch (true) {
		case maxUvIndex < 2:
			uvRating = 'safe';
			break;
		case maxUvIndex < 8:
			uvRating = 'danger';
			break;
		default:
			uvRating = 'extreme';
			break;
	}

	const ratingColour = (rating: SafetyRating) => {
		if (rating === 'safe') return 'green';
		if (rating === 'warning') return 'yellow';
		if (rating === 'danger') return 'orange';
		return 'red';
	};
</script>

<section>
	<div>
		<h2>Dog safety (temperature):</h2>
		<Paw colour={ratingColour(dogRating)} />
	</div>
	<div>
		<h2>Human safety (UV):</h2>
		<Sun colour={ratingColour(uvRating)} />
	</div>
</section>

<style>
	@media screen and (max-width: 600px) {
		section {
			grid-row-start: 1;
		}
	}
	section {
		padding: 1rem;
	}

	h2 {
		margin: 0;
	}

	div {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
