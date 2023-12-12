<script lang="ts">
	import { colour } from '$lib/colours';
	import Paw from '$lib/icons/Paw.svelte';
	import Sun from '$lib/icons/Sun.svelte';
	import * as Card from '$lib/shadcn/ui/card';

	export let maxTemperature: number;
	export let maxUvIndex: number;

	type SafetyRating = 'safe' | 'warning' | 'danger' | 'extreme';

	let dogRating: SafetyRating = 'safe';
	let uvRating: SafetyRating = 'safe';

	$: switch (true) {
		case maxTemperature < 20:
			dogRating = 'safe';
			break;
		case maxTemperature < 25:
			dogRating = 'warning';
			break;
		case maxTemperature < 30:
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

	const ratingColour = (rating: SafetyRating) => {
		if (rating === 'safe') return colour.green;
		if (rating === 'warning') return colour.yellow;
		if (rating === 'danger') return colour.orange;
		return colour.red;
	};
</script>

<Card.Root class="flex flex-col items-center row-start-1 md:row-start-auto">
	<Card.Header>
		<Card.Title>Dog safety (temperature):</Card.Title>
	</Card.Header>
	<Card.Content class="flex flex-col items-center">
		<Paw strokeColour={ratingColour(dogRating)} />
		<p>Max {Math.round(maxTemperature)}&deg;C</p>
	</Card.Content>
	<Card.Header>
		<Card.Title>Human safety (UV):</Card.Title>
	</Card.Header>
	<Card.Content class="flex flex-col items-center">
		<Sun strokeColour={ratingColour(uvRating)} />
		<p>Max UV index {Math.round(maxUvIndex)}</p>
	</Card.Content>
</Card.Root>
