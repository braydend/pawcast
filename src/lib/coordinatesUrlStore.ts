import { goto } from '$app/navigation';
import type { Coordinates } from './types';

export const setCoordinates = async (newCoords: Coordinates) => {
	const params = new URLSearchParams();

	params.set('lat', newCoords.lat.toString(10));
	params.set('long', newCoords.long.toString(10));

	await goto(`?${params.toString()}`, {replaceState: true, invalidateAll: true});
};
