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

	//TODO: Cannot dynamically assemble classnames, so this is the current workaround
	// These colours reference the values in the colours.ts file
	const borderColours = {
		red: "border-[#dc2626]",
		darkBlue : "border-[#4f46e5]",
		lightBlue: "border-[#0ea5e9]",
		orange: "border-[#f97316]",
	}

	let borderColour = borderColours.red;

	switch (true) {
		case temperature < 15:
			borderColour = borderColours.darkBlue;
			break;
		case temperature < 25:
			borderColour = borderColours.lightBlue;
			break;
		case temperature < 30:
			borderColour = borderColours.orange;
			break;
		default:
			borderColour = borderColours.red;
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
