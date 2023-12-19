<script lang="ts">
	import type { Forecast } from '$lib/types';
	import WeatherCard from './WeatherCard.svelte';

	export let forecast: Forecast['hourly'];
</script>

<section class="overflow-x-hidden">
	<h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Forecast</h2>
	<div class="flex flex-row overflow-x-scroll gap-4 p-4 items-center">
		{#each forecast as report}
			<WeatherCard
				rainfall={report.rain ?? 0}
				temperature={report.temperature}
				time={report.time}
				uvIndex={report.uvIndex}
				description={report.description}
				icon={report.icon}
			/>
		{/each}
	</div>
</section>
