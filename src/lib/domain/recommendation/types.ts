import type { Grade } from '$lib/types';

export type RecommendationMessages = {
	[key in Grade]: string[];
};

export type Recommendation = {
	type: 'UV' | 'air-temperature' | 'ground-temperature';
	subject: 'dog' | 'human';
	grade: Grade;
	timeStart: number;
	timeEnd: number;
};
