import { OPEN_WEATHER_MAP_API_KEY } from '$env/static/private';
import type { Location, ReverseGeolocate } from './types';

export const geolacate = async (postcode: string): Promise<Location> => {
	// TODO: allow country selection
	const auCountryCode = 'AU';
	const apiKey = OPEN_WEATHER_MAP_API_KEY;
	return await fetch(
		`http://api.openweathermap.org/geo/1.0/zip?zip=${postcode},${auCountryCode}&appid=${apiKey}`
	).then((d) => d.json());
};

export const reverseGeolocate = async (lat: number, long: number): Promise<ReverseGeolocate[]> => {
	const apiKey = OPEN_WEATHER_MAP_API_KEY;
	const limit = 1;
	return await fetch(
		`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${long}&limit=${limit}&appid=${apiKey}`
	).then((d) => d.json());
};
