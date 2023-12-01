<script lang="ts">
	import WeatherCard from '$lib/components/WeatherCard.svelte';

	export let data;

	let forecastOffset = 0;

	console.log({ data });

	const selectedForecasts = data.data.hourly.slice(forecastOffset, forecastOffset + 30);
</script>

<main class="container">
	<section class="forecast">
		{#each selectedForecasts as forecast}
			<WeatherCard
				rainfall={forecast.rain?.['1h'] ?? 0}
				temperature={forecast.temp}
				time={forecast.dt}
				uvIndex={forecast.uvi}
			/>
		{/each}
	</section>
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

	.forecast {
		display: flex;
		flex-direction: row;
		overflow-x: scroll;
		gap: 1rem;
		padding: 1rem;
	}
</style>
