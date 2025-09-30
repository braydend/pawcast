<script lang="ts">
	import * as d3 from 'd3';
	import dayjs from 'dayjs';

	type ChartData = {
		uvIndex: number;
		time: number;
	};

	const {data, width = 640, height=400, marginTop=20, marginRight=20, marginBottom=20, marginLeft=20}: {data: ChartData[],
		width?: number, height?: number, marginTop?: number, marginRight?: number, marginBottom?: number, marginLeft?: number
	} = $props();

	console.log(data);

	let x = $state(d3.scaleLinear().domain([0,10]).range([marginLeft, width - marginRight]));
	//   const y = d3.scaleLinear()
	// .domain([0, d3.max(unemployment, d => d.unemployment)]).nice()
	// 	.range([height - marginBottom, marginTop]);
	let y = $state(d3.scaleLinear().domain([0, d3.max(d3.extent(data, d => d.uvIndex))]).range([height - marginBottom, marginTop]));
	let line = $derived(d3.line((d, i) => x(i), y));
	let bottomAxis: SVGGElement | null = null;
	let sideAxis: SVGGElement | null = null;

	$effect(() => {
		if (bottomAxis) {
		d3.select(bottomAxis).call(d3.axisBottom(x));
	}});

	$effect(() => {
		if (sideAxis) {
			d3.select(sideAxis).call(d3.axisLeft(y));
		}});
</script>
<svg width={width} height={height}>
	<path fill="none" stroke="currentColor" stroke-width="1.5" d={line(data)} />
	<g fill="white" stroke="currentColor" stroke-width="1.5">
		{#each data as d, i}
			<circle key={i} cx={x(i)} cy={y(d)} r="2.5" />
		{/each}
	</g>
	<g bind:this={bottomAxis} transform="translate(0,{height - marginBottom})" />
	<g bind:this={sideAxis} transform="translate({marginLeft},0)" />
</svg>
