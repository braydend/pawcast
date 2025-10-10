<script lang="ts">
	import type { ForecastRecord } from '$lib/types';
	import { onDestroy, onMount } from 'svelte';
	import * as d3 from 'd3';
	import ChartTooltip, { type TooltipData } from './chart/ChartTooltip.svelte';

	interface Props {
		forecast: ForecastRecord[];
		height?: number;
	}

	let { forecast, height = 280 }: Props = $props();

	// Series colors
	const COLOR_TEMP = '#0ea5e9'; // tailwind sky-500
	const COLOR_UV = '#f97316'; // tailwind orange-500

	// Layout
	const MARGIN = { top: 24, right: 48, bottom: 28, left: 44 } as const;

	type ChartPoint = {
		time: Date;
		temperatureC: number;
		uvIndex: number;
		description: string;
		rainMm: number;
	};

	let containerEl: HTMLDivElement | undefined;
	let svgRoot: d3.Selection<SVGSVGElement, unknown, null, undefined> | undefined;
	let chartGroup: d3.Selection<SVGGElement, unknown, null, undefined> | undefined;
	let resizeObserver: ResizeObserver | undefined;

	// Tooltip state (Svelte-rendered; no innerHTML)
	let hoveredPoint: TooltipData | null = $state(null);
	let tooltipLeft = $state(0);
	let tooltipTop = $state(0);
	let tooltipVisible = $state(false);

	function render() {
		if (!containerEl) return;
		const width = containerEl.clientWidth;
		const innerWidth = Math.max(0, width - MARGIN.left - MARGIN.right);
		const innerHeight = Math.max(0, height - MARGIN.top - MARGIN.bottom);

		if (!svgRoot) {
			svgRoot = d3
				.select(containerEl)
				.append('svg')
				.attr('width', width)
				.attr('height', height);
			chartGroup = svgRoot
				.append('g')
				.attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);
			chartGroup.append('g').attr('class', 'x-axis');
			chartGroup.append('g').attr('class', 'y-axis-left');
			chartGroup
				.append('g')
				.attr('class', 'y-axis-right')
				.attr('transform', `translate(${innerWidth},0)`);
			chartGroup.append('path').attr('class', 'line-temperature').attr('fill', 'none');
			chartGroup.append('path').attr('class', 'line-uv').attr('fill', 'none');
			chartGroup.append('g').attr('class', 'legend');
			// Axis labels
			chartGroup.append('text').attr('class', 'y-label-left').attr('font-size', 12);
			chartGroup.append('text').attr('class', 'y-label-right').attr('font-size', 12);
		} else {
			svgRoot.attr('width', width).attr('height', height);
			chartGroup!.select('.y-axis-right').attr('transform', `translate(${innerWidth},0)`);
		}

		// Prepare data
		const data: ChartPoint[] = (forecast ?? []).map((d) => ({
			time: new Date(d.time * 1000),
			temperatureC: d.temperature,
			uvIndex: d.uvIndex,
			description: d.description,
			rainMm: d.rain ?? 0
		}));

		if (!data.length) {
			chartGroup!.selectAll('.line-temperature,.line-uv').attr('d', null);
			chartGroup!.selectAll('.x-axis,.y-axis-left,.y-axis-right').selectAll('*').remove();
			chartGroup!.select('.legend').selectAll('*').remove();
			chartGroup!.selectAll('.focus').style('display', 'none');
			tooltipVisible = false;
			return;
		}

		// Scales
		const xScale = d3
			.scaleTime()
			.domain(d3.extent(data, (d) => d.time) as [Date, Date])
			.range([0, innerWidth]);

		const temperatureMin = d3.min(data, (d) => d.temperatureC) ?? 0;
		const temperatureMax = d3.max(data, (d) => d.temperatureC) ?? 0;
		const yTempScale = d3
			.scaleLinear()
			.domain([Math.floor(temperatureMin - 2), Math.ceil(temperatureMax + 2)])
			.nice()
			.range([innerHeight, 0]);

		const uvMax = Math.max(11, d3.max(data, (d) => d.uvIndex) ?? 0);
		const yUvScale = d3
			.scaleLinear()
			.domain([0, uvMax])
			.nice()
			.range([innerHeight, 0]);

		// Axes
		const shortTime = d3.timeFormat('%-I%p');
		const xAxis = d3.axisBottom<Date>(xScale).ticks(6).tickFormat((d: Date) => shortTime(d));
		const yLeftAxis = d3.axisLeft(yTempScale).ticks(5).tickFormat((d: number | string) => `${d}`);
		const yRightAxis = d3.axisRight(yUvScale).ticks(5).tickFormat((d: number | string) => `${d}`);

		(chartGroup!.select('.x-axis') as d3.Selection<SVGGElement, unknown, null, undefined>)
			.attr('transform', `translate(0,${innerHeight})`)
			.call(xAxis);
		(chartGroup!.select('.y-axis-left') as d3.Selection<SVGGElement, unknown, null, undefined>).call(yLeftAxis);
		(chartGroup!.select('.y-axis-right') as d3.Selection<SVGGElement, unknown, null, undefined>).call(yRightAxis);

		// Axis labels
		chartGroup!
			.select<SVGTextElement>('.y-label-left')
			.attr('transform', `translate(${-28},${innerHeight / 2}) rotate(-90)`) // minor tightened offset
			.attr('text-anchor', 'middle')
			.text('Temperature (°C)');

		chartGroup!
			.select<SVGTextElement>('.y-label-right')
			.attr('transform', `translate(${innerWidth + 20},${innerHeight / 2}) rotate(90)`) // minor tightened offset
			.attr('text-anchor', 'middle')
			.text('UV Index');

		// Lines
		const temperatureLine = d3
			.line<{ time: Date; temperatureC: number }>()
			.x((d) => xScale(d.time))
			.y((d) => yTempScale(d.temperatureC))
			.curve(d3.curveMonotoneX);

		const uvLine = d3
			.line<{ time: Date; uvIndex: number }>()
			.x((d) => xScale(d.time))
			.y((d) => yUvScale(d.uvIndex))
			.curve(d3.curveMonotoneX);

		chartGroup!
			.select<SVGPathElement>('.line-temperature')
			.datum(data.map((d) => ({ time: d.time, temperatureC: d.temperatureC })))
			.attr('stroke', COLOR_TEMP)
			.attr('stroke-width', 2)
			.attr('d', temperatureLine);

		chartGroup!
			.select<SVGPathElement>('.line-uv')
			.datum(data.map((d) => ({ time: d.time, uvIndex: d.uvIndex })))
			.attr('stroke', COLOR_UV)
			.attr('stroke-width', 2)
			.attr('d', uvLine);

		// Legend (kept as SVG for minimal change)
		const legend = chartGroup!.select<SVGGElement>('.legend');
		const legendItems = [
			{ color: COLOR_TEMP, label: 'Temperature (°C)' },
			{ color: COLOR_UV, label: 'UV Index' }
		];
		const legendItem = legend
			.attr('transform', `translate(0,${-8})`)
			.selectAll('g')
			.data(legendItems)
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

		// Focus group (guideline + circles)
		let focus = chartGroup!.select<SVGGElement>('.focus');
		if (focus.empty()) {
			focus = chartGroup!.append('g').attr('class', 'focus').style('display', 'none');
			focus
				.append('line')
				.attr('class', 'focus-line')
				.attr('stroke', '#9ca3af')
				.attr('stroke-dasharray', '4,4');
			focus.append('circle').attr('class', 'focus-temp').attr('r', 4).attr('stroke', COLOR_TEMP).attr('fill', '#fff');
			focus.append('circle').attr('class', 'focus-uv').attr('r', 4).attr('stroke', COLOR_UV).attr('fill', '#fff');
		}
		// Position the guideline to plotting height
		focus.select<SVGLineElement>('.focus-line').attr('y1', 0).attr('y2', innerHeight);

		// find nearest by time
		const bisectTime = d3.bisector<ChartPoint, Date>((d) => d.time).left;

		function showAt(point: ChartPoint) {
			const cx = xScale(point.time);
			const cyTemp = yTempScale(point.temperatureC);
			const cyUv = yUvScale(point.uvIndex);

			focus.style('display', null);
			focus.select<SVGLineElement>('.focus-line').attr('x1', cx).attr('x2', cx);
			focus.select<SVGCircleElement>('.focus-temp').attr('cx', cx).attr('cy', cyTemp);
			focus.select<SVGCircleElement>('.focus-uv').attr('cx', cx).attr('cy', cyUv);

			// Update tooltip state for Svelte component
				hoveredPoint = {
					time: point.time,
					temperatureC: point.temperatureC,
					uvIndex: point.uvIndex,
					rainMm: point.rainMm,
					description: point.description
				};
			// position near the vertical line, clamped into container
			const offset = 12;
			const leftCandidate = MARGIN.left + cx + offset;
			const rightCandidate = MARGIN.left + cx - offset; // used when tooltip would overflow
			// Estimate width after first render; we don't know size here, so we clamp conservatively
			const containerWidth = width;
			const approximateTooltipWidth = 200; // conservative
			tooltipLeft = leftCandidate + approximateTooltipWidth > containerWidth ? rightCandidate - approximateTooltipWidth : leftCandidate;
			tooltipTop = MARGIN.top + Math.min(cyTemp, cyUv) - 8;
			if (tooltipTop < 0) tooltipTop = 0;
			tooltipVisible = true;
		}

		function handleMouseMove(event: MouseEvent) {
			const [mouseX] = d3.pointer(event, chartGroup!.node() as Element);
			const xAtCursor = xScale.invert(mouseX);
			let index = bisectTime(data, xAtCursor, 1);
			if (index >= data.length) index = data.length - 1;
			if (index <= 0) index = 0;
			const prev = data[index - 1] ?? data[index];
			const next = data[index];
			const chosen = !prev
				? next
				: !next
				? prev
				: xAtCursor.getTime() - prev.time.getTime() > next.time.getTime() - xAtCursor.getTime()
				? next
				: prev;
			showAt(chosen as ChartPoint);
		}

		function handleMouseLeave() {
			focus.style('display', 'none');
			hoveredPoint = null;
			tooltipVisible = false;
		}

		// Overlay for mouse events
		chartGroup!
			.selectAll('rect.overlay')
			.data([null])
			.join('rect')
			.attr('class', 'overlay')
			.attr('x', 0)
			.attr('y', 0)
			.attr('width', innerWidth)
			.attr('height', innerHeight)
			.attr('fill', 'transparent')
			.style('cursor', 'crosshair')
			.on('mousemove', handleMouseMove)
			.on('mouseenter', () => {
				focus.style('display', null);
				tooltipVisible = true;
			})
			.on('mouseleave', handleMouseLeave);
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
		svgRoot = undefined;
		chartGroup = undefined;
	});
</script>

<section class="chart-section">
	<h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Temperature & UV</h2>
	<div bind:this={containerEl} class="relative h-auto w-full" aria-label="Temperature and UV line chart">
		<ChartTooltip data={hoveredPoint} left={tooltipLeft} top={tooltipTop} visible={tooltipVisible} />
	</div>
</section>

<style>
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
