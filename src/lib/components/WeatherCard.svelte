<script lang="ts">
	import { colour } from '$lib/colours';
import * as Card from '$lib/shadcn/ui/card';
import dayjs from 'dayjs';

	export let temperature: number;
	export let uvIndex: number;
	export let time: number;
	export let rainfall: number;
	export let description: string;
	export let icon: string;

	const formattedTime = dayjs.unix(time).format('h:mm a D MMM');

	let borderColour = `border-[${colour.red}]`;

	switch (true) {
		case temperature < 15:
			borderColour = `border-[${colour.darkBlue}]`;
			break;
		case temperature < 25:
			borderColour = `border-[${colour.lightBlue}]`;
			break;
		case temperature < 30:
			borderColour = `border-[${colour.orange}]`;
			break;
		default:
			borderColour = `border-[${colour.red}]`;
			break;
	}
</script>

<Card.Root class={borderColour}>
	<Card.Header>
		<Card.Title class="whitespace-nowrap">{formattedTime}</Card.Title>
	</Card.Header>
	<Card.Content class="flex flex-col items-center">
		<img src={`https://openweathermap.org/img/wn/${icon}.png`} alt={description} />
		<p>{temperature}&deg;C</p>
		<p>UV: {uvIndex}</p>
		<p>Rain: {rainfall}mm</p>
	</Card.Content>
</Card.Root>

<style>
	p {
		margin: 0;
	}
</style>
