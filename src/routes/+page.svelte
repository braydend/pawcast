<script lang="ts">
	import Dashboard from '$lib/components/Dashboard.svelte';
	import type { Forecast } from '$lib/types';
	const { data } = $props<{ data: { initialForecast: Forecast | null } }>();
</script>

<div class="p-4">
	<Dashboard initialForecast={data.initialForecast ?? undefined} />
</div>
