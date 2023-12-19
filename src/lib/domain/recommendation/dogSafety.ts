import type { RecommendationMessages } from './types';

export const temperatureLimits = {
	safe: 20,
	warning: 25,
	danger: 30
} as const;

export const airTemperatureMessages: RecommendationMessages = {
	safe: ['Safe for most outdoor activities'],
	warning: ['Heat stroke risk for rigorous exercise'],
	danger: [
		'High risk.',
		'Exercise lightly, water often.',
		'Can be life threatening for young puppies and large dogs.'
	],
	extreme: ['Extremely high risk of heat stroke for all dogs.', 'Maybe swim instead']
};

const DEFAULT_GROUND_TEMP_MESSAGE =
	"Hard surfaces can be far hotter than the air temperature. Be mindful of the surfaces your dog walks on. Try holding the back of your hand on the ground for 7 seconds. If it's too hot for you, it's too hot for your dog!";

export const groundTemperatureMessages: RecommendationMessages = {
	safe: [],
	warning: [DEFAULT_GROUND_TEMP_MESSAGE],
	danger: [DEFAULT_GROUND_TEMP_MESSAGE],
	extreme: [DEFAULT_GROUND_TEMP_MESSAGE]
};
