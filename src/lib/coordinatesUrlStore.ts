import { goto } from '$app/navigation';
import type { Coordinates } from './types';

export const getCoordinates = (): Coordinates | undefined => {
	const params = new URLSearchParams(location.search);
	const lat = params.get('lat');
	const long = params.get('long');

	if (!lat || !long) return;

	if (isNaN(parseFloat(lat)) || isNaN(parseFloat(long))) {
		console.error(`Invalid values`);
		return;
	}

	return { lat: Number(lat), long: Number(long) };
};

export const setCoordinates = (newCoords: Coordinates) => {
	const params = new URLSearchParams();

	params.set('lat', newCoords.lat.toString(10));
	params.set('long', newCoords.long.toString(10));

	goto(`?${params.toString()}`);
};
