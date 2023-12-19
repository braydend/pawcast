import type { RecommendationMessages } from './types';

export const uvIndexLimits = {
	safe: 2,
	warning: 5,
	danger: 8
} as const;

export const uvIndexMessages: RecommendationMessages = {
	safe: [
		'Generally safe.',
		'Consider wearing sunscreen and a hat if you will be in direct sunlight for a while.'
	],
	warning: ['Sunscreen required if you will be outside for a while.', 'Try to seek out shade'],
	danger: [
		'High risk.',
		'Sunscreen, hat and glasses are required if you will go outside at all.',
		'Seek shade to break up your time directly exposed to the sun'
	],
	extreme: [
		'Extremely high risk.',
		'Sunscreen, hat and glasses are required if you will go outside at all.',
		'Seek shade to break up your time directly exposed to the sun.',
		'Avoid the sun between 10am and 3pm'
	]
};
