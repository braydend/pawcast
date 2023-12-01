<script lang="ts">
	import Forecast from '$lib/components/Forecast.svelte';
	import Glance from '$lib/components/Glance.svelte';

	export let data;

	const selectedForecasts = data.data.hourly.slice(0, 24);
	const maxTemperature = selectedForecasts.reduce((acc, { temp }) => {
		if (acc > temp) return temp;
		return acc;
	}, 0);
	const maxUvIndex = selectedForecasts.reduce((acc, { uvi }) => {
		if (acc > uvi) return uvi;
		return acc;
	}, 0);
</script>

<main class="container">
	<Forecast forecast={selectedForecasts} />
	<Glance {maxTemperature} {maxUvIndex} />
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
