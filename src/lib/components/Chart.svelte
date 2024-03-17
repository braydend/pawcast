<script lang="ts">
	import * as d3 from 'd3';
	import dayjs from 'dayjs';
	import { onMount } from 'svelte';

	type DataType = { temperature: number; time: number; uvIndex: number };

	export let rawData: DataType[];
	const data = rawData.map(({ time, ...rest }) => ({
		time: dayjs.unix(time).startOf('hour'),
		...rest
	}));
	const tooHotData = data.filter(({ temperature }) => temperature >= 22);
	const notTooHotData = data.filter(({ temperature }) => temperature <= 22);

	onMount(() => {
		drawChart();
	});

	const svgWidth = 600,
		svgHeight = 400;
	const margin = { top: 20, right: 30, bottom: 30, left: 40 };
	const width = svgWidth - margin.left - margin.right;
	const height = svgHeight - margin.top - margin.bottom;

	const x = d3
		.scaleLinear()
		.domain(d3.extent(data, (d) => d.time))
		.range([0, width]);

	const y = d3
		.scaleLinear()
		.domain([0, d3.max(data, (d) => d.temperature)])
		.range([height, 0]);

	const line = (xKey: keyof DataType, yKey: keyof DataType) =>
		d3
			.line()
			.x((d) => x(d[xKey]))
			.y((d) => y(d[yKey]));

	const addTemperatureLine = (svg: unknown) => {
		svg
			.append('path')
			.datum(data)
			.attr('fill', 'none')
			.attr('stroke', 'steelblue')
			.attr('stroke-width', 8)
			.attr('d', line('time', 'temperature'));
	};

	const addUVLine = (svg: unknown) => {
		svg
			.append('path')
			.datum(data)
			.attr('fill', 'none')
			.attr('stroke', 'green')
			.attr('stroke-width', 8)
			.attr('d', line('time', 'uvIndex'));
	};

	function drawChart() {
		const svg = d3
			.select<HTMLDivElement, DataType>('#chart')
			.append('svg')
			.attr('width', svgWidth)
			.attr('height', svgHeight)
			.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		svg.append('g').call(d3.axisLeft(y));

		svg
			.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(d3.axisBottom(x).tickFormat(d3.timeFormat('%H:%M')))
			.selectAll('text')
			.style('text-anchor', 'end')
			.attr('dx', '-.8em')
			.attr('dy', '.15em')
			.attr('transform', 'rotate(-65)');

		addTemperatureLine(svg);
		addUVLine(svg);
	}
</script>

<div id="chart"></div>
