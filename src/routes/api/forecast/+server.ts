import { forecast } from '$lib/domain/forecast';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const lat = parseFloat(url.searchParams.get('lat') ?? '');
	const long = parseFloat(url.searchParams.get('long') ?? '');

	if (!lat || !long) {
		throw error(500, 'Missing latitude or longitude');
	}

	const result = await forecast(lat, long);

	return json(result);
};
