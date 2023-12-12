<script lang="ts">
import * as Card from '$lib/shadcn/ui/card';
import dayjs from 'dayjs';

	export let temperature: number;
	export let uvIndex: number;
	export let time: number;
	export let rainfall: number;
	export let description: string;
	export let icon: string;

	const formattedTime = dayjs.unix(time).format('h:mm a D MMM');

	// red-600
	let borderColour = 'border-[#dc2626]';

	switch (true) {
		case temperature < 15:
			// indigo-600
			borderColour = 'border-[#4f46e5]';
			break;
		case temperature < 25:
			// sky-500
			borderColour = 'border-[#0ea5e9]';
			break;
		case temperature < 30:
			// orange-500
			borderColour = 'border-[#f97316]';
			break;
		default:
			// red-600
			borderColour = 'border-[#dc2626]';
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
