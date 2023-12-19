<script lang="ts">
	import { temperatureLimits } from "$lib/domain/recommendation/dogSafety";
	import { uvIndexLimits } from "$lib/domain/recommendation/humanSafety";
	import type { Recommendation } from "$lib/domain/recommendation/types";
	import type { ForecastRecord } from "$lib/types";
	import RecommendationCard from "./RecommendationCard.svelte";

    export let forecasts: ForecastRecord[];

    const RECOMMENDATION_GRADES_TO_INCLUDE = ["warning","danger","extreme"];

    const gradedTemperatureForecasts = forecasts.map<Recommendation>((forecast) => {
        if (forecast.temperature < temperatureLimits.safe) {
            return {
                type: "air-temperature", 
                subject: "dog",
                grade: "safe",
                timeStart: forecast.time,
                timeEnd: forecast.time,
            }
        }
        if (forecast.temperature < temperatureLimits.warning) {
            return {
                type: "air-temperature", 
                subject: "dog",
                grade: "warning",
                timeStart: forecast.time,
                timeEnd: forecast.time,
            }
        }
        if (forecast.temperature < temperatureLimits.danger) {
            return {
                type: "air-temperature", 
                subject: "dog",
                grade: "danger",
                timeStart: forecast.time,
                timeEnd: forecast.time,
            }
        }
        return {
                type: "air-temperature", 
                subject: "dog",
                grade: "extreme",
                timeStart: forecast.time,
                timeEnd: forecast.time,
            }
    })
    .filter(({ grade}) => RECOMMENDATION_GRADES_TO_INCLUDE.includes(grade))
    .toSorted(({timeStart: a}, {timeStart: b}) => a<b?0:1)
    ;

    const gradedUvIndexForecasts = forecasts.map<Recommendation>((forecast) => {
        if (forecast.uvIndex < uvIndexLimits.safe) {
            return {
                type: "UV", 
                subject: "human",
                grade: "safe",
                timeStart: forecast.time,
                timeEnd: forecast.time,
            }
        }
        if (forecast.uvIndex < uvIndexLimits.warning) {
            return {
                type: "UV", 
                subject: "human",
                grade: "warning",
                timeStart: forecast.time,
                timeEnd: forecast.time,
            }
        }
        if (forecast.uvIndex < uvIndexLimits.danger) {
            return {
                type: "UV", 
                subject: "human",
                grade: "danger",
                timeStart: forecast.time,
                timeEnd: forecast.time,
            }
        }
        return {
                type: "UV", 
                subject: "human",
                grade: "extreme",
                timeStart: forecast.time,
                timeEnd: forecast.time,
            }
    })
    .filter(({ grade}) => RECOMMENDATION_GRADES_TO_INCLUDE.includes(grade))
    .toSorted(({timeStart: a}, {timeStart: b}) => a<b?0:1)
    ;

    const airTemperatureRecommendations = gradedTemperatureForecasts
        .reduce<Recommendation[]>((acc, cur) => {
            const prev = acc.at(-1);
            if (acc.length === 0 || !prev) {
                return [...acc, cur];
            }
            if (prev.grade === cur.grade) {
                const rest = acc.slice(0,-1);
                return [...rest, {...prev, timeEnd: cur.timeEnd}];
            }
            return [...acc, cur];
        }, new Array<Recommendation>());

    const groundTemperatureRecommendations = gradedTemperatureForecasts
        .reduce<Recommendation[]>((acc, cur) => {
            const currentGround: Recommendation = {
                ...cur, 
                type: "ground-temperature",
            };
            const prev = acc.at(-1);
            if (acc.length === 0 || !prev) {
                return [...acc, currentGround];
            }
            if (prev.timeEnd + 3600 === currentGround.timeStart) {
                const rest = acc.slice(0,-1);
                return [...rest, {...prev, timeEnd: currentGround.timeEnd}];
            }
            return [...acc, currentGround];
        }, new Array<Recommendation>());

    const uvIndexRecommendations = gradedUvIndexForecasts
        .reduce<Recommendation[]>((acc, cur) => {
            const currentGround: Recommendation = {
                ...cur, 
                type: "UV",
            };
            const prev = acc.at(-1);
            if (acc.length === 0 || !prev) {
                return [...acc, currentGround];
            }
            if (prev.grade === currentGround.grade) {
                const rest = acc.slice(0,-1);
                return [...rest, {...prev, timeEnd: currentGround.timeEnd}];
            }
            return [...acc, currentGround];
        }, new Array<Recommendation>());

    const allRecommendations = [...airTemperatureRecommendations, ...groundTemperatureRecommendations, ...uvIndexRecommendations]
        .toSorted(({timeStart: a}, {timeStart: b}) => a<b?0:1);


</script>
<section class="col-start-1 col-span-2 gap-4 flex flex-col">
    <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Recommendations</h2>
    {#each allRecommendations as recommendation}
        <RecommendationCard {recommendation} />
    {/each}
</section>