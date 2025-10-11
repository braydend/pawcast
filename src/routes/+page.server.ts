import { getLast24HourForecastForLatLong } from '$lib/domain/getForecastForLatLong';
import type { Forecast } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const lat = parseFloat(url.searchParams.get('lat') ?? '');
	const long = parseFloat(url.searchParams.get('long') ?? '');

	if (!lat || !long) {
		return { initialForecast: null as Forecast | null };
	}

	const initialForecast = await getLast24HourForecastForLatLong(lat, long);
	return { initialForecast };
};
