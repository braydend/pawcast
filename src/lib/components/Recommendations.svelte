<script lang="ts">
	import { getColourForGrade } from "$lib/colours";
	import { temperatureLimits } from "$lib/domain/dogSafety";
	import { getRecommendationMessages } from "$lib/domain/recommendation";
	import Paw from "$lib/icons/Paw.svelte";
	import * as Card from "$lib/shadcn/ui/card";
	import type { ForecastRecord, Grade } from "$lib/types";
	import dayjs from "dayjs";

    export let forecasts: ForecastRecord[];

    const RECOMMENDATION_GRADES_TO_INCLUDE = ["warning","danger","extreme"];

    type Recommendation = {
        type: "UV"|"air-temperature"|"ground-temperature";
        subject: "dog"|"human";
        grade: Grade;
        timeStart: number;
        timeEnd: number;
    };

    const gradedForecasts = forecasts.map<Recommendation>((forecast) => {
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

    const airTemperatureRecommendations = gradedForecasts
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

    const groundTemperatureRecommendations = gradedForecasts
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

    const allRecommendations = [...airTemperatureRecommendations, ...groundTemperatureRecommendations]
        .toSorted(({timeStart: a}, {timeStart: b}) => a<b?0:1);

    //TODO: Cannot dynamically assemble classnames, so this is the current workaround
	// These colours reference the values in the colours.ts file
	const borderColours = {
		red: "border-[#dc2626]",
		darkBlue : "border-[#4f46e5]",
		lightBlue: "border-[#0ea5e9]",
		orange: "border-[#f97316]",
	} as const;

    const gradeToColour = (grade: Grade): keyof typeof borderColours => {
        if (grade === "safe") return "darkBlue";
        if (grade === "warning") return "lightBlue";
        if (grade === "danger") return "orange";
        return "red";
    }
</script>
<section class="col-start-1 col-span-2 gap-4 flex flex-col">
    <h3>Recommendations</h3>
    {#each allRecommendations as recommendation}
        <Card.Root class={borderColours[gradeToColour(recommendation.grade)]}>
            <Card.Header>
                <Paw strokeColour={getColourForGrade(recommendation.grade)} />
                <h4>{dayjs.unix(recommendation.timeStart).format('h:mm a D MMM')} - {dayjs.unix(recommendation.timeEnd).endOf("hour").format('h:mm a D MMM')}</h4>
            </Card.Header>
            <Card.Content>
                {#each getRecommendationMessages(recommendation.grade, recommendation.type) as message}
                    <p>{message}</p>
                {/each}
            </Card.Content>
        </Card.Root>
    {/each}
</section>