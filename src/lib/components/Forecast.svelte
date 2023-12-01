<script lang="ts">
	import type { WeatherReport } from '$lib/openWeatherMap/types';
	import WeatherCard from './WeatherCard.svelte';

	export let forecast: WeatherReport[];
</script>

<section class="forecast">
	{#each forecast as report}
		<WeatherCard
			rainfall={report.rain?.['1h'] ?? 0}
			temperature={report.temp}
			time={report.dt}
			uvIndex={report.uvi}
			weather={report.weather[0]}
		/>
	{/each}
</section>

<style>
	.forecast {
		display: flex;
		flex-direction: row;
		overflow-x: scroll;
		gap: 1rem;
		padding: 1rem;
	}
</style>
