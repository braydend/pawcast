import type { Forecast } from '$lib/types';

export const getForecast = async (lat: number, long:number): Promise<Forecast> => fetch(`/api/forecast?lat=${lat}&long=${long}`).then((d) =>
	d.json()
);