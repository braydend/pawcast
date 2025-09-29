<script lang="ts">
	import { run } from 'svelte/legacy';

	import { getColourForGrade } from '$lib/colours';
	import { temperatureLimits } from '$lib/domain/recommendation/dogSafety';
	import { uvIndexLimits } from '$lib/domain/recommendation/humanSafety';
	import Paw from '$lib/icons/Paw.svelte';
	import Sun from '$lib/icons/Sun.svelte';
	import * as Card from '$lib/shadcn/ui/card';
	import type { Grade } from '$lib/types';

	interface Props {
		maxTemperature: number;
		maxUvIndex: number;
	}

	let { maxTemperature, maxUvIndex }: Props = $props();

	let dogRating: Grade = $state('safe');
	let uvRating: Grade = $state('safe');

	run(() => {
		switch (true) {
			case maxTemperature < temperatureLimits.safe:
				dogRating = 'safe';
				break;
			case maxTemperature < temperatureLimits.warning:
				dogRating = 'warning';
				break;
			case maxTemperature < temperatureLimits.danger:
				dogRating = 'danger';
				break;
			default:
				dogRating = 'extreme';
				break;
		}
	});

	run(() => {
		switch (true) {
			case maxUvIndex < uvIndexLimits.safe:
				uvRating = 'safe';
				break;
			case maxUvIndex < uvIndexLimits.warning:
				uvRating = 'warning';
				break;
			case maxUvIndex < uvIndexLimits.danger:
				uvRating = 'danger';
				break;
			default:
				uvRating = 'extreme';
				break;
		}
	});
</script>

<Card.Root class="flex flex-col items-center row-start-1 md:row-start-auto">
	<Card.Header>
		<Card.Title>Dog safety (temperature):</Card.Title>
	</Card.Header>
	<Card.Content class="flex flex-col items-center">
		<Paw strokeColour={getColourForGrade(dogRating)} />
		<p>Max {Math.round(maxTemperature)}&deg;C</p>
	</Card.Content>
	<Card.Header>
		<Card.Title>Human safety (UV):</Card.Title>
	</Card.Header>
	<Card.Content class="flex flex-col items-center">
		<Sun strokeColour={getColourForGrade(uvRating)} />
		<p>Max UV index {Math.round(maxUvIndex)}</p>
	</Card.Content>
</Card.Root>
