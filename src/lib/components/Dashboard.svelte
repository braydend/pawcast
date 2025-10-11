<script lang="ts">
	import { colour } from '$lib/colours';
	import Forecast from '$lib/components/Forecast.svelte';
	import Glance from '$lib/components/Glance.svelte';
	import LocationPicker from '$lib/components/LocationPicker.svelte';
	import { setCoordinates } from '$lib/coordinatesUrlStore';
	import Paw from '$lib/icons/Paw.svelte';
	import type { Coordinates, ForecastRecord, Forecast as ForecastType } from '$lib/types';
	import Recommendations from './Recommendations.svelte';
	import { navigating } from '$app/state';
	
	const { initialForecast } = $props<{ initialForecast?: ForecastType }>();
	
	const PLACEHOLDER_LOCATION_NAME = 'Select a location';

	let forecast: ForecastRecord[] = $derived(initialForecast?.hourly ?? []);
	let locationName: string = $state(initialForecast?.locationName ?? PLACEHOLDER_LOCATION_NAME);

	const handleLocationChange = async (location: Coordinates) => {
		await setCoordinates(location);
	};

	let hasForecast = $derived(forecast.length > 0);
</script>

<main class="flex flex-col gap-4">
	<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Pawcast</h1>
	<div class="container">
		<LocationPicker
			onLocationChange={handleLocationChange}
			{locationName} />

		{#if navigating.to !== null}
			<div class="spinner"><Paw strokeColour={colour.lightBlue} /></div>
		{:else if hasForecast}
			<Forecast forecast={forecast} />
			<Glance forecast={forecast} />
			<Recommendations forecasts={forecast} />
		{/if}
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
