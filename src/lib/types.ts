export type Forecast = {
	locationName: string;
	hourly: ForecastRecord[];
};

export type ForecastRecord = {
	uvIndex: number;
	temperature: number;
	time: number;
	icon: string;
	description: string;
	rain?: number;
};

export type Coordinates = { lat: number; long: number };
