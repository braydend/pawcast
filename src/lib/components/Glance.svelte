<script lang="ts">
	import { getColourForGrade } from '$lib/colours';
	import { temperatureLimits } from '$lib/domain/recommendation/dogSafety';
	import { uvIndexLimits } from '$lib/domain/recommendation/humanSafety';
	import Paw from '$lib/icons/Paw.svelte';
	import Sun from '$lib/icons/Sun.svelte';
	import * as Card from '$lib/shadcn/ui/card';
	import type { ForecastRecord, Grade } from '$lib/types';

	interface Props {
		forecast: ForecastRecord[];
	}

	let { forecast }: Props = $props();

	const getMaxTemperature = (forecast: ForecastRecord[]) => forecast.reduce((acc, { temperature }) => {
		if (acc < temperature) return temperature;
		return acc;
	}, 0);
	let getMaxUvIndex = (forecast: ForecastRecord[]) => forecast.reduce((acc, { uvIndex }) => {
		if (acc < uvIndex) return uvIndex;
		return acc;
	}, 0);

	const getTemperatureRating = (forecast: ForecastRecord[]): Grade => {
		const maxTemperature = getMaxTemperature(forecast);
		switch (true) {
			case maxTemperature < temperatureLimits.safe:
				return 'safe';
			case maxTemperature < temperatureLimits.warning:
				return 'warning';
			case maxTemperature < temperatureLimits.danger:
				return 'danger';
			default:
				return 'extreme';
		}
	};

	const getUvRating = (forecast: ForecastRecord[]): Grade => {
		const maxUvIndex = getMaxUvIndex(forecast);
		switch (true) {
			case maxUvIndex < uvIndexLimits.safe:
				return 'safe';
			case maxUvIndex < uvIndexLimits.warning:
				return 'warning';
			case maxUvIndex < uvIndexLimits.danger:
				return 'danger';
			default:
				return 'extreme';
		}
	}

	const dogRating = getTemperatureRating( forecast);
	const uvRating = getUvRating(forecast);
</script>

<Card.Root class="flex flex-col items-center row-start-1 md:row-start-auto">
	<Card.Header>
		<Card.Title>Dog safety (temperature):</Card.Title>
	</Card.Header>
	<Card.Content class="flex flex-col items-center">
		<Paw strokeColour={getColourForGrade(dogRating)} />
		<p>Max {Math.round(getMaxTemperature(forecast))}&deg;C</p>
	</Card.Content>
	<Card.Header>
		<Card.Title>Human safety (UV):</Card.Title>
	</Card.Header>
	<Card.Content class="flex flex-col items-center">
		<Sun strokeColour={getColourForGrade(uvRating)} />
		<p>Max UV index {Math.round(getMaxUvIndex(forecast))}</p>
	</Card.Content>
</Card.Root>
