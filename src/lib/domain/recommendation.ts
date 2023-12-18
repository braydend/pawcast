import type { Grade } from '$lib/types';
import { airTemperatureMessages, groundTemperatureMessages } from './dogSafety';

export const getTemperatureRecommendations = (grade: Grade) => {
	return [airTemperatureMessages[grade], groundTemperatureMessages[grade]].filter((msg) =>
		Boolean(msg)
	);
};
