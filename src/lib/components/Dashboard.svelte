<script lang="ts">
	import { colour } from '$lib/colours';
	import Forecast from '$lib/components/Forecast.svelte';
	import Glance from '$lib/components/Glance.svelte';
	import LocationPicker from '$lib/components/LocationPicker.svelte';
	import { getCoordinates, setCoordinates } from '$lib/coordinatesUrlStore';
	import Paw from '$lib/icons/Paw.svelte';
	import { forecastStore } from '$lib/stores/forecast';
	import type { Coordinates, ForecastRecord, Forecast as ForecastType } from '$lib/types';
	import { onMount } from 'svelte';
	import Recommendations from './Recommendations.svelte';

	const PLACEHOLDER_LOCATION_NAME = 'Select a location';

	let selectedForecasts: ForecastRecord[] = [];
	let locationName: string = PLACEHOLDER_LOCATION_NAME;
	let forecastPromise: Promise<ForecastType>;

	onMount(async () => {
		let coordinates = getCoordinates();
		if (!coordinates) return;

		await updateForecast(coordinates);
	});

	forecastStore.subscribe((d) => {
		selectedForecasts = d?.hourly.slice(0, 24) ?? [];
		locationName = d?.locationName ?? PLACEHOLDER_LOCATION_NAME;
	});

	$: maxTemperature = selectedForecasts.reduce((acc, { temperature }) => {
		if (acc < temperature) return temperature;
		return acc;
	}, 0);
	$: maxUvIndex = selectedForecasts.reduce((acc, { uvIndex }) => {
		if (acc < uvIndex) return uvIndex;
		return acc;
	}, 0);

	const handleLocationChange = async (location: Coordinates) => {
		await updateForecast(location);
	};

	const updateForecast = async (location: Coordinates) => {
		forecastPromise = fetch(`/api/forecast?lat=${location.lat}&long=${location.long}`).then((d) =>
			d.json()
		);

		setCoordinates(location);
		forecastStore.set(await forecastPromise);
	};
</script>

<main class="flex flex-col gap-4">
	<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Pawcast</h1>
	<div class="container">
		<LocationPicker onLocationChange={handleLocationChange} {locationName} />
		{#await forecastPromise}
			<div class="spinner"><Paw strokeColour={colour.lightBlue} /></div>
		{:then _}
			{#if $forecastStore}
				<Forecast forecast={selectedForecasts} />
				<Glance {maxTemperature} {maxUvIndex} />
				<Recommendations forecasts={selectedForecasts} />
			{/if}
		{/await}
	</div>
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

	.spinner {
		animation: 1s ease-in-out infinite rotate;
		width: min-content;
		height: min-content;
	}

	@keyframes rotate {
		0% {
			transform: rotate(0);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
