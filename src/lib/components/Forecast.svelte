<script lang="ts">
	import type { Forecast } from '$lib/types';
	import WeatherCard from './WeatherCard.svelte';

	export let forecast: Forecast['hourly'];
</script>

<section class="forecast">
	{#each forecast as report}
		<WeatherCard
			rainfall={report.rain ?? 0}
			temperature={report.temperature}
			time={report.time}
			uvIndex={report.uvIndex}
			description={report.description}
			icon={report.icon}
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
		align-items: center;
	}
</style>
