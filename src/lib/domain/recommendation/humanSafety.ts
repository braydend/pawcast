import type { RecommendationMessages } from './types';

export const uvIndexLimits = {
	safe: 2,
	warning: 5,
	danger: 8
} as const;

const SUNSCREEN_REQUIRED = 'Sunscreen (SPF 30+) required if you will be in direct sunlight.';
const HAT_RECOMMENDED = 'A hat are highly recommended if you will be in direct sunlight.';
const SHADE_RECOMMENDED = 'Seek shade to break up your time directly exposed to the sun';

export const uvIndexMessages: RecommendationMessages = {
	safe: [
		'Generally safe.',
		'Consider wearing sunscreen and a hat if you will be in direct sunlight for a while.'
	],
	warning: ['Moderate risk', SUNSCREEN_REQUIRED, SHADE_RECOMMENDED],
	danger: ['High risk.', SUNSCREEN_REQUIRED, HAT_RECOMMENDED, SHADE_RECOMMENDED],
	extreme: [
		'Extremely high risk.',
		SUNSCREEN_REQUIRED,
		HAT_RECOMMENDED,
		SHADE_RECOMMENDED,
		'Try to avoid the sun between 10am and 3pm, when the UV is at its strongest.'
	]
};
