<script lang="ts">
	import Dashboard from '$lib/components/Dashboard.svelte';
	import Chart from '$lib/components/Chart.svelte';
	import { getCoordinates } from '$lib/coordinatesUrlStore';
	import { getForecast } from '$lib/client/getForecast';

	const coordinates = getCoordinates();
</script>

<div class="p-4">
	{#if coordinates}
		{#await getForecast(coordinates.lat, coordinates.long)}
			<div>loading</div>
			{:then forecast}
	<Chart data={forecast.hourly.map(({uvIndex}) => uvIndex)} />
			{/await}
		{/if}
		<Dashboard />
</div>
