import type { Grade } from '$lib/types';
import { airTemperatureMessages, groundTemperatureMessages } from './dogSafety';

export const getTemperatureRecommendations = (grade: Grade) => {
	return [airTemperatureMessages[grade], groundTemperatureMessages[grade]].filter((msg) =>
		Boolean(msg)
	);
};

export const getRecommendationMessages = (
	grade: Grade,
	type: 'UV' | 'ground-temperature' | 'air-temperature' | 'all'
) => {
	let messages: (string | undefined)[];

	switch (type) {
		case 'UV':
			messages = []; // TODO: Build out UV recommendations
			break;
		case 'air-temperature':
			messages = [airTemperatureMessages[grade]];
			break;
		case 'ground-temperature':
			messages = [groundTemperatureMessages[grade]];
			break;
		case 'all':
		default:
			messages = [groundTemperatureMessages[grade], airTemperatureMessages[grade]];
			break;
	}

	return messages.filter((msg) => Boolean(msg));
};
