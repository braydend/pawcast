<script lang="ts">
	import dayjs from 'dayjs';

	export interface TooltipData {
		time: Date;
		temperatureC: number;
		uvIndex: number;
		rainMm?: number;
		description?: string;
	}

	interface Props {
		data: TooltipData | null;
		left: number;
		top: number;
		visible?: boolean;
	}

	let { data, left, top, visible = false }: Props = $props();
</script>

{#if visible && data}
	<div
		class="pointer-events-none absolute z-10 max-w-[220px] rounded-md border border-gray-200 bg-white p-2 text-xs shadow-lg dark:border-gray-800 dark:bg-gray-900"
		style={`left:${left}px; top:${top}px;`}
		role="tooltip"
	>
		<div class="mb-1 font-semibold">
			{dayjs(data.time).format('h:mm A, ddd MMM D')}
		</div>
		<div class="my-0.5 flex items-center gap-1.5">
			<span class="inline-block h-2.5 w-2.5 rounded-sm" style="background:#0ea5e9"></span>
			<span>Temp:</span>
			<strong>{data.temperatureC.toFixed(1)}°C</strong>
		</div>
		<div class="my-0.5 flex items-center gap-1.5">
			<span class="inline-block h-2.5 w-2.5 rounded-sm" style="background:#f97316"></span>
			<span>UV:</span>
			<strong>{data.uvIndex.toFixed(1)}</strong>
		</div>
		{#if data.rainMm !== undefined}
			<div class="my-0.5">Rain: <strong>{data.rainMm.toFixed(1)} mm</strong></div>
		{/if}
		{#if data.description}
			<div class="mt-1 opacity-90">{data.description}</div>
		{/if}
	</div>
{/if}
