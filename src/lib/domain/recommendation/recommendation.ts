import type { Grade } from '$lib/types';
import { airTemperatureMessages, groundTemperatureMessages } from './dogSafety';
import { uvIndexMessages } from './humanSafety';

export const getTemperatureRecommendations = (grade: Grade) => {
	return [airTemperatureMessages[grade], groundTemperatureMessages[grade]].filter((msg) =>
		Boolean(msg)
	);
};

export const getRecommendationMessages = (
	grade: Grade,
	type: 'UV' | 'ground-temperature' | 'air-temperature' | 'all'
) => {
	let messages: string[];

	switch (type) {
		case 'UV':
			messages = uvIndexMessages[grade];
			break;
		case 'air-temperature':
			messages = airTemperatureMessages[grade];
			break;
		case 'ground-temperature':
			messages = groundTemperatureMessages[grade];
			break;
		case 'all':
		default:
			messages = [...groundTemperatureMessages[grade], ...airTemperatureMessages[grade]];
			break;
	}

	return messages;
};
