<script lang="ts">
	import { getColourForGrade } from "$lib/colours";
	import { getRecommendationMessages } from "$lib/domain/recommendation/recommendation";
	import type { Recommendation } from "$lib/domain/recommendation/types";
	import Paw from "$lib/icons/Paw.svelte";
	import Sun from "$lib/icons/Sun.svelte";
	import Thermometer from "$lib/icons/Thermometer.svelte";
	import * as Card from "$lib/shadcn/ui/card";
	import type { Grade } from "$lib/types";
	import dayjs from "dayjs";

    export let recommendation: Recommendation;

    // TODO: Cannot dynamically assemble classnames, so this is the current workaround
	// These colours reference the values in the colours.ts file
	const borderColours = {
		red: "border-[#dc2626]",
		yellow: "border-[#fde047]",
		orange: "border-[#f97316]",
	} as const;

    const gradeToColour = (grade: Grade): keyof typeof borderColours => {
        if (grade === "warning") return "yellow";
        if (grade === "danger") return "orange";
        return "red";
    }

    const getTitle = (rec: Recommendation) => {
        if (rec.type === "UV") return "UV Index Warning"
        if (rec.type === "air-temperature") return "Temperature Warning for Dogs"
        if (rec.type === "ground-temperature") return "Ground Temperature Warning for Dogs"
    }
</script>

<Card.Root class={borderColours[gradeToColour(recommendation.grade)]}>
    <Card.Header>
        {#if recommendation.type === "UV"}
            <Sun strokeColour={getColourForGrade(recommendation.grade)} /> 
        {:else if recommendation.type === "air-temperature"}
            <Thermometer strokeColour={getColourForGrade(recommendation.grade)} /> 
        {:else}
            <Paw strokeColour={getColourForGrade(recommendation.grade)} />
        {/if}
        <h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">{getTitle(recommendation)}</h3>
        <p class="text-xl text-muted-foreground">{dayjs.unix(recommendation.timeStart).format('h:mm a D MMM')} - {dayjs.unix(recommendation.timeEnd).endOf("hour").format('h:mm a D MMM')}</p>
    </Card.Header>
    <Card.Content>
        {#each getRecommendationMessages(recommendation.grade, recommendation.type) as message}
            <p>{message}</p>
        {/each}
    </Card.Content>
</Card.Root>