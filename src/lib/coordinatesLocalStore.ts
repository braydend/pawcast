import type { Coordinates } from './types';

const STORAGE_KEY = 'pawcast-coordinates';

export const getCoordinates = (): Coordinates | undefined => {
	const storedValue = localStorage.getItem(STORAGE_KEY);

	if (!storedValue) return;

	const parsedValue = JSON.parse(storedValue);
	if (!Object.hasOwn(parsedValue, 'lat') || !Object.hasOwn(parsedValue, 'long')) {
		console.error(`Missing required keys`);
		return;
	}

	if (isNaN(parsedValue.lat) || isNaN(parsedValue.long)) {
		console.error(`Invalid values`);
		return;
	}

	return parsedValue;
};

export const setCoordinates = (newCoords: Coordinates) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(newCoords));
};
