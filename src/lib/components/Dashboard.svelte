<script lang="ts">
	import Forecast from '$lib/components/Forecast.svelte';
	import Glance from '$lib/components/Glance.svelte';
	import LocationPicker from '$lib/components/LocationPicker.svelte';
	import { forecastStore } from '$lib/stores/forecast';
	import type { Forecast as ForecastType } from '$lib/types';

	const PLACEHOLDER_LOCATION_NAME = 'Select a location';

	let selectedForecasts: ForecastType['hourly'] = [];
	let locationName: string = PLACEHOLDER_LOCATION_NAME;

	forecastStore.subscribe((d) => {
		selectedForecasts = d?.hourly.slice(0, 24) ?? [];
		locationName = d?.locationName ?? PLACEHOLDER_LOCATION_NAME;
	});

	const maxTemperature = selectedForecasts.reduce((acc, { temperature }) => {
		if (acc < temperature) return temperature;
		return acc;
	}, 0);
	const maxUvIndex = selectedForecasts.reduce((acc, { uvIndex }) => {
		if (acc < uvIndex) return uvIndex;
		return acc;
	}, 0);

	const handleLocationChange = async (location: { lat: number; long: number }) => {
		const updatedForecast = await fetch(
			`/api/forecast?lat=${location.lat}&long=${location.long}`
		).then((d) => d.json());

		forecastStore.set(updatedForecast);
	};
</script>

<main class="container">
	<LocationPicker onLocationChange={handleLocationChange} {locationName} />
	{#if $forecastStore}
		<Forecast forecast={selectedForecasts} />
		<Glance {maxTemperature} {maxUvIndex} />
		<section class="recommendations">Recommendations</section>
	{/if}
</main>

<style>
	.container {
		display: grid;
		gap: 1rem;
	}
	@media screen and (max-width: 600px) {
		.container {
			grid-template-columns: 1fr;
		}
	}

	@media screen and (min-width: 600px) {
		.container {
			grid-template-columns: 2fr 1fr;
		}
	}

	section {
		border: 1px solid black;
	}

	.recommendations {
		grid-column: 1 / span 2;
	}
</style>
