<script lang="ts">
	import Forecast from '$lib/components/Forecast.svelte';

	export let data;

	// TODO: Maybe remove this?
	// Was intending to use this to allow the user to advance forecasts
	// For now I've enabled scrolling, that should do
	let forecastOffset = 0;

	console.log({ data });

	const selectedForecasts = data.data.hourly.slice(forecastOffset, forecastOffset + 24);
</script>

<main class="container">
	<Forecast forecast={selectedForecasts} />
	<section>At-a-glance day rating</section>
	<section class="recommendations">Recommendations</section>
</main>

<style>
	.container {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 1rem;
	}

	section {
		border: 1px solid black;
	}

	.recommendations {
		grid-column: 1 / span 2;
	}
</style>
