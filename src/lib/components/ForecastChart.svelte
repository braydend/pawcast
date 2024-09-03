<script lang="ts">
    import Chart from "chart.js/auto"
	import type { Forecast } from '$lib/types';
	import { onMount } from "svelte";
	import dayjs from "dayjs";
	import { uvIndexLimits } from "../domain/recommendation/humanSafety";
	import { temperatureLimits } from "../domain/recommendation/dogSafety";
	import { colour } from "../colours";

		export let forecast: Forecast['hourly'];

        onMount(() => {
            const ctx = document.getElementById('myChart');

            if (!ctx || !(ctx instanceof HTMLCanvasElement)) {
                console.error('Could not find canvas element');
                return;
            }

            const myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: forecast.map(({ time }) => dayjs.unix(time).format('h:mm a')),
                    datasets: [{
                        // label: 'Temperature',
                        data: forecast.map(({ temperature }) => temperature),
                        fill: false,
                        // borderColor: "rgb(255, 99, 132)",
                        segment: {
                            borderColor: ({p0: {parsed: {y: temperature}}}) => temperature >= temperatureLimits.danger ? colour.red :  temperature >= temperatureLimits.warning ? colour.yellow : colour.green
                        },
                        tension: 0.1,
                        yAxisID: 'yTemperature'
                    },
                    {
                        // label: 'UV Index',
                        data: forecast.map(({ uvIndex }) => uvIndex),
                        segment: {
                            borderColor: ({p0: {parsed: {y: uvValue}}}) => uvValue >= uvIndexLimits.danger ? colour.red :  uvValue >= uvIndexLimits.warning ? colour.yellow : colour.green
                        },
                        // borderColor: 'rgb(255, 205, 86)',
                        fill: false,
                        tension: 0.1,
                        yAxisID: 'yUv'
                    }]
                },
                options: {
                    elements: {
                        point: {
                            radius: 0
                        }
                    },
                    scales: {
                        yTemperature: {
                            beginAtZero: true,
                            position: 'left',
                            type: 'linear',
                            title: {
                                display: true,
                                text: 'Temperature (°C)',
                                color: 'rgb(255, 99, 132)',
                                font: {
                                    size: 20,
                                    weight: 'bold'
                                }
                            }
                        },
                        yUv: {
                            beginAtZero: true,
                            max: 14,
                            position: 'right',
                            type: 'linear',
                            title: {
                                display: true,
                                text: 'Uv Index',
                                color: 'rgb(255, 205, 86)',
                                font: {
                                    size: 20,
                                    weight: 'bold'
                                }
                            }
                        }
                    }
                }
            });
        });
</script>

<div>
    forecasts: {forecast.length}
    <canvas id="myChart"></canvas>
</div>