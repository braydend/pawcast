export type Forecast = {
	locationName: string;
	hourly: HourlyForecast[];
};

type HourlyForecast = {
	uvIndex: number;
	temperature: number;
	time: number;
	icon: string;
	description: string;
	rain?: number;
};

export type Coordinates = { lat: number; long: number };
