import { OPEN_WEATHER_MAP_API_KEY } from '$env/static/private';
import type { Location } from './types';

export const geolacate = async (postcode: string): Promise<Location> => {
	// TODO: allow country selection
	const auCountryCode = 'AU';
	const apiKey = OPEN_WEATHER_MAP_API_KEY;
	return await fetch(
		`http://api.openweathermap.org/geo/1.0/zip?zip=${postcode},${auCountryCode}&appid=${apiKey}`
	).then((d) => d.json());
};
