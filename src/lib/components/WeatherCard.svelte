<script lang="ts">
	import type { Weather } from '$lib/openWeatherMap/types';
	import dayjs from 'dayjs';

	export let temperature: number;
	export let uvIndex: number;
	export let time: number;
	export let rainfall: number;
	export let weather: Weather;

	const formattedTime = dayjs.unix(time).format('h:mm a D MMM');

	let colour = 'red';

	switch (true) {
		case temperature < 15:
			colour = 'darkblue';
			break;
		case temperature < 25:
			colour = 'lightblue';
			break;
		case temperature < 30:
			colour = 'orange';
			break;
		default:
			colour = 'red';
			break;
	}
</script>

<div class="container" style={`--colour: ${colour}`}>
	<p class="time">{formattedTime}</p>
	<img src={`https://openweathermap.org/img/wn/${weather.icon}.png`} alt={weather.description} />
	<p>{temperature}&deg;C</p>
	<p>UV: {uvIndex}</p>
	<p>Rain: {rainfall}mm</p>
</div>

<style>
	.container {
		border: 3px solid;
		border-radius: 3px;
		padding: 0.5rem;
		border-color: var(--colour);
		align-items: center;
		display: flex;
		flex-direction: column;
	}

	.time {
		white-space: nowrap;
		padding-bottom: 0.5rem;
	}

	p {
		margin: 0;
	}
</style>
