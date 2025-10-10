<script lang="ts">
	import type { ForecastRecord } from '$lib/types';
	import { onDestroy, onMount } from 'svelte';
	import * as d3 from 'd3';

	interface Props {
		forecast: ForecastRecord[];
		height?: number;
	}

	let { forecast, height = 280 }: Props = $props();

	let containerEl: HTMLDivElement | undefined;
	let svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | undefined;
	let gRoot: d3.Selection<SVGGElement, unknown, null, undefined> | undefined;
	let resizeObserver: ResizeObserver | undefined;

	function render() {
		if (!containerEl) return;
		const width = containerEl.clientWidth;
		const margin = { top: 24, right: 48, bottom: 28, left: 44 };
		const innerWidth = Math.max(0, width - margin.left - margin.right);
		const innerHeight = Math.max(0, height - margin.top - margin.bottom);

		if (!svg) {
			svg = d3
				.select(containerEl)
				.append('svg')
				.attr('width', width)
				.attr('height', height);
			gRoot = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
			gRoot.append('g').attr('class', 'x-axis');
			gRoot.append('g').attr('class', 'y-axis-left');
			gRoot.append('g').attr('class', 'y-axis-right').attr('transform', `translate(${innerWidth},0)`);
			gRoot.append('path').attr('class', 'line-temp').attr('fill', 'none');
			gRoot.append('path').attr('class', 'line-uv').attr('fill', 'none');
			gRoot.append('g').attr('class', 'legend');
		} else {
			svg.attr('width', width).attr('height', height);
			gRoot!.select('.y-axis-right').attr('transform', `translate(${innerWidth},0)`);
		}

		// Data guards
		const data = (forecast ?? []).map((d) => ({
			time: new Date(d.time * 1000),
			temp: d.temperature,
			uvi: d.uvIndex
		}));
		if (!data.length) {
			// clear
			gRoot!.selectAll('.line-temp,.line-uv').attr('d', null);
			gRoot!.selectAll('.x-axis,.y-axis-left,.y-axis-right').selectAll('*').remove();
			gRoot!.select('.legend').selectAll('*').remove();
			return;
		}

		const x = d3
			.scaleTime()
			.domain(d3.extent(data, (d) => d.time) as [Date, Date])
			.range([0, innerWidth]);

		const tempMin = d3.min(data, (d) => d.temp) ?? 0;
		const tempMax = d3.max(data, (d) => d.temp) ?? 0;
		const yLeft = d3
			.scaleLinear()
			.domain([Math.floor(tempMin - 2), Math.ceil(tempMax + 2)])
			.nice()
			.range([innerHeight, 0]);

		const uvMax = Math.max(11, d3.max(data, (d) => d.uvi) ?? 0);
		const yRight = d3
			.scaleLinear()
			.domain([0, uvMax])
			.nice()
			.range([innerHeight, 0]);

		const timeFmt = d3.timeFormat('%-I%p');
		const xAxis = d3.axisBottom<Date>(x).ticks(6).tickFormat((d: Date) => timeFmt(d));
		const yLeftAxis = d3.axisLeft(yLeft).ticks(5).tickFormat((d: number | string) => `${d}`);
		const yRightAxis = d3.axisRight(yRight).ticks(5).tickFormat((d: number | string) => `${d}`);

		(gRoot!.select('.x-axis') as d3.Selection<SVGGElement, unknown, null, undefined>)
			.attr('transform', `translate(0,${innerHeight})`)
			.call(xAxis);
		(gRoot!.select('.y-axis-left') as d3.Selection<SVGGElement, unknown, null, undefined>).call(yLeftAxis);
		(gRoot!.select('.y-axis-right') as d3.Selection<SVGGElement, unknown, null, undefined>).call(yRightAxis);

		const tempLine = d3
			.line<{ time: Date; temp: number }>()
			.x((d) => x(d.time))
			.y((d) => yLeft(d.temp))
			.curve(d3.curveMonotoneX);

		const uvLine = d3
			.line<{ time: Date; uvi: number }>()
			.x((d) => x(d.time))
			.y((d) => yRight(d.uvi))
			.curve(d3.curveMonotoneX);

		gRoot!
			.select<SVGPathElement>('.line-temp')
			.datum(data.map((d) => ({ time: d.time, temp: d.temp })))
			.attr('stroke', '#0ea5e9')
			.attr('stroke-width', 2)
			.attr('d', tempLine);

		gRoot!
			.select<SVGPathElement>('.line-uv')
			.datum(data.map((d) => ({ time: d.time, uvi: d.uvi })))
			.attr('stroke', '#f97316')
			.attr('stroke-width', 2)
			.attr('d', uvLine);

		// Legend
		const legend = gRoot!.select<SVGGElement>('.legend');
		const items = [
			{ color: '#0ea5e9', label: 'Temperature (°C)' },
			{ color: '#f97316', label: 'UV Index' }
		];
		const legendItem = legend
			.attr('transform', `translate(0,${-8})`)
			.selectAll('g')
			.data(items)
			.join((enter) => enter.append('g'))
			.attr('transform', (_, i) => `translate(${i * 160},0)`);
		legendItem
			.selectAll('rect')
			.data((d) => [d])
			.join('rect')
			.attr('width', 12)
			.attr('height', 12)
			.attr('fill', (d) => d.color)
			.attr('rx', 2)
			.attr('ry', 2);
		legendItem
			.selectAll('text')
			.data((d) => [d])
			.join('text')
			.attr('x', 16)
			.attr('y', 10)
			.attr('font-size', 12)
			.text((d) => d.label);
	}

	onMount(() => {
		// initial render and observe resize
		render();
		if (containerEl) {
			resizeObserver = new ResizeObserver(() => render());
			resizeObserver.observe(containerEl);
		}
	});

	$effect(() => {
		// re-render on data change
		render();
	});

	onDestroy(() => {
		resizeObserver?.disconnect();
		resizeObserver = undefined;
		svg = undefined;
		gRoot = undefined;
	});
</script>

<section class="chart-section">
	<h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Temperature & UV</h2>
	<div bind:this={containerEl} class="chart-container" aria-label="Temperature and UV line chart"></div>
</section>

<style>
	.chart-container {
		width: 100%;
		height: auto;
	}

	:global(svg text) {
		fill: currentColor;
	}

	:global(.x-axis path),
	:global(.x-axis line),
	:global(.y-axis-left path),
	:global(.y-axis-left line),
	:global(.y-axis-right path),
	:global(.y-axis-right line) {
		stroke: #d1d5db; /* tailwind gray-300 */
	}
</style>
