<script lang="ts">
	import { getColourForGrade } from '$lib/colours';
	import { temperatureLimits } from '$lib/domain/dogSafety';
	import Paw from '$lib/icons/Paw.svelte';
	import Sun from '$lib/icons/Sun.svelte';
	import * as Card from '$lib/shadcn/ui/card';

	export let maxTemperature: number;
	export let maxUvIndex: number;

	type SafetyRating = 'safe' | 'warning' | 'danger' | 'extreme';

	let dogRating: SafetyRating = 'safe';
	let uvRating: SafetyRating = 'safe';

	$: switch (true) {
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

	$: switch (true) {
		case maxUvIndex < 2:
			uvRating = 'safe';
			break;
		case maxUvIndex < 8:
			uvRating = 'danger';
			break;
		default:
			uvRating = 'extreme';
			break;
	}
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
