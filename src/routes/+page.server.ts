import { forecast, geolacate as geolocate } from '$lib/openWeatherMap';

export const load = async () => {
	const data = await forecast(await geolocate('3070'));

	return { data };
};
