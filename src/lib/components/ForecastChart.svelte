<script lang="ts">
	import type { ForecastRecord } from '$lib/types';
	import { onDestroy, onMount } from 'svelte';
	import * as d3 from 'd3';

	interface Props {
		forecast: ForecastRecord[];
		height?: number;
	}

	let { forecast, height = 280 }: Props = $props();
	type DataPoint = { time: Date; temp: number; uvi: number; description: string; rain: number };

	let containerEl: HTMLDivElement | undefined;
	let svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | undefined;
	let gRoot: d3.Selection<SVGGElement, unknown, null, undefined> | undefined;
	let resizeObserver: ResizeObserver | undefined;
	let tooltipEl: HTMLDivElement | undefined;

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
			// Axis labels (created once; positioned each render)
			gRoot.append('text').attr('class', 'y-label-left').attr('font-size', 12);
			gRoot.append('text').attr('class', 'y-label-right').attr('font-size', 12);
		} else {
			svg.attr('width', width).attr('height', height);
			gRoot!.select('.y-axis-right').attr('transform', `translate(${innerWidth},0)`);
		}

		// Data guards
		const data: DataPoint[] = (forecast ?? []).map((d) => ({
			time: new Date(d.time * 1000),
			temp: d.temperature,
			uvi: d.uvIndex,
			description: d.description,
			rain: d.rain ?? 0
		}));
		if (!data.length) {
			// clear
			gRoot!.selectAll('.line-temp,.line-uv').attr('d', null);
			gRoot!.selectAll('.x-axis,.y-axis-left,.y-axis-right').selectAll('*').remove();
			gRoot!.select('.legend').selectAll('*').remove();
			gRoot!.selectAll('.focus').style('display', 'none');
			if (tooltipEl) tooltipEl.style.opacity = '0';
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

		// Axis labels
		gRoot!
			.select<SVGTextElement>('.y-label-left')
			.attr('transform', `translate(${-28},${innerHeight / 2}) rotate(-90)`)
			.attr('text-anchor', 'middle')
			.text('Temperature (°C)');
		gRoot!
			.select<SVGTextElement>('.y-label-right')
			.attr('transform', `translate(${innerWidth + 20},${innerHeight / 2}) rotate(90)`)
			.attr('text-anchor', 'middle')
			.text('UV Index');

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

		// Tooltip div (HTML) created once
		if (!tooltipEl) {
			tooltipEl = document.createElement('div');
			tooltipEl.className = 'chart-tooltip';
			tooltipEl.style.position = 'absolute';
			tooltipEl.style.pointerEvents = 'none';
			tooltipEl.style.opacity = '0';
			containerEl.appendChild(tooltipEl);
		}

		// Focus group (guideline + circles), created once
		let focus = gRoot!.select<SVGGElement>('.focus');
		if (focus.empty()) {
			focus = gRoot!.append('g').attr('class', 'focus').style('display', 'none');
			focus.append('line').attr('class', 'focus-line').attr('stroke', '#9ca3af').attr('stroke-dasharray', '4,4');
			focus.append('circle').attr('class', 'focus-temp').attr('r', 4).attr('stroke', '#0ea5e9').attr('fill', '#fff');
			focus.append('circle').attr('class', 'focus-uv').attr('r', 4).attr('stroke', '#f97316').attr('fill', '#fff');
		}

		// Position the focus line to span the plotting area each render
		focus.select<SVGLineElement>('.focus-line')
			.attr('y1', 0)
			.attr('y2', innerHeight);

		const bisectDate = d3.bisector<DataPoint, Date>((d) => d.time).left;
		const longTimeFmt = d3.timeFormat('%-I:%M %p, %a %b %-d');

		function showAt(d: DataPoint) {
			const cx = x(d.time);
			const cyTemp = yLeft(d.temp);
			const cyUv = yRight(d.uvi);

			focus.style('display', null);
			focus.select<SVGLineElement>('.focus-line').attr('x1', cx).attr('x2', cx);
			focus.select<SVGCircleElement>('.focus-temp').attr('cx', cx).attr('cy', cyTemp);
			focus.select<SVGCircleElement>('.focus-uv').attr('cx', cx).attr('cy', cyUv);

			if (tooltipEl && containerEl) {
				tooltipEl.style.opacity = '1';
				tooltipEl.innerHTML = `
					<div class="tt-time">${longTimeFmt(d.time)}</div>
					<div class="tt-row"><span class="swatch" style="background:#0ea5e9"></span>Temp: <strong>${d.temp.toFixed(1)}°C</strong></div>
					<div class="tt-row"><span class="swatch" style="background:#f97316"></span>UV: <strong>${d.uvi.toFixed(1)}</strong></div>
					${d.rain ? `<div class="tt-row">Rain: <strong>${d.rain.toFixed(1)} mm</strong></div>` : ''}
					<div class="tt-desc">${d.description}</div>
				`;
				const rect = containerEl.getBoundingClientRect();
				// Position near the vertical line, with small offset and clamped inside container
				const offset = 12;
				const ttBox = tooltipEl.getBoundingClientRect();
				let left = margin.left + cx + offset;
				if (left + ttBox.width - rect.left > rect.width) {
					left = margin.left + cx - ttBox.width - offset;
				}
				let top = margin.top + Math.min(cyTemp, cyUv) - 8;
				if (top < 0) top = 0;
				tooltipEl.style.left = `${left}px`;
				tooltipEl.style.top = `${top}px`;
			}
		}

		function onMouseMove(event: MouseEvent) {
			const [mx] = d3.pointer(event, gRoot!.node() as Element);
			const x0 = x.invert(mx);
			let i = bisectDate(data, x0, 1);
			if (i >= data.length) i = data.length - 1;
			if (i <= 0) i = 0;
			const d0 = data[i - 1] ?? data[i];
			const d1 = data[i];
			const d = (!d0 ? d1 : !d1 ? d0 : (x0.getTime() - d0.time.getTime() > d1.time.getTime() - x0.getTime() ? d1 : d0)) as DataPoint;
			showAt(d);
		}

		function onMouseLeave() {
			focus.style('display', 'none');
			if (tooltipEl) tooltipEl.style.opacity = '0';
		}

		// Overlay to capture mouse events, sized each render
		gRoot!
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
			.on('mousemove', onMouseMove)
			.on('mouseenter', () => {
				focus.style('display', null);
				if (tooltipEl) tooltipEl.style.opacity = '1';
			})
			.on('mouseleave', onMouseLeave);
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
		position: relative;
		width: 100%;
		height: auto;
	}

	:global(.chart-tooltip) {
		color: inherit;
		border: 1px solid #e5e7eb; /* gray-200 */
		border-radius: 0.375rem; /* rounded-md */
		box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
		padding: 8px 10px;
		font-size: 12px;
		line-height: 1.2;
		max-width: 220px;
		z-index: 10;
	}
	:global(.chart-tooltip .tt-time) { font-weight: 600; margin-bottom: 4px; }
	:global(.chart-tooltip .tt-row) { display: flex; align-items: center; gap: 6px; margin: 2px 0; }
	:global(.chart-tooltip .swatch) { display:inline-block; width:10px; height:10px; border-radius:2px; }
	:global(.chart-tooltip .tt-desc) { margin-top: 4px; opacity: 0.9; }

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
