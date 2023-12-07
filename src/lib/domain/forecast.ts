import { reverseGeolocate, forecast as owmForecast } from '$lib/openWeatherMap';
import type { Forecast } from '$lib/types';

export const forecast = async (lat: number, long: number): Promise<Forecast> => {
	const [location] = await reverseGeolocate(lat, long);

	const locationParts = [location.name, location.state, location.country].filter((part) =>
		Boolean(part)
	);

	const forecastResults = await owmForecast({ lat, lon: long });

	return {
		locationName: locationParts.join(', '),
		hourly: forecastResults.hourly.map((d) => ({
			icon: d.weather[0].icon,
			temperature: d.temp,
			time: d.dt,
			uvIndex: d.uvi,
			rain: d.rain?.['1h'],
			description: d.weather[0].description
		}))
	};
};
