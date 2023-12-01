import { OPEN_WEATHER_MAP_API_KEY } from '$env/static/private';
import type { Forecast, Location } from './types';

export const forecast = async ({ lat, lon }: Location): Promise<Forecast> => {
	const apiKey = OPEN_WEATHER_MAP_API_KEY;
	//TODO: allow units selection
	const unit = 'metric';

	return await fetch(
		`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}&exclude=minutely,daily,current`
	).then((d) => d.json());
};
