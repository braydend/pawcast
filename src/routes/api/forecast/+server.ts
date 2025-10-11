import { getForecastForLatLong } from '$lib/domain/getForecastForLatLong';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const lat = parseFloat(url.searchParams.get('lat') ?? '');
	const long = parseFloat(url.searchParams.get('long') ?? '');

	if (!lat || !long) {
		error(500, 'Missing latitude or longitude');
	}

	const result = await getForecastForLatLong(lat, long);

	return json(result);
};
