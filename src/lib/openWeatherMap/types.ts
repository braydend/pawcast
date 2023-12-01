export type Location = {
	country: string;
	lat: number;
	lon: number;
	name: string;
	zip: string;
};

export type Forecast = {
	lat: number;
	lon: number;
	timezone: string;
	timezone_offset: number;
	hourly: Current[];
	alerts: Alert[];
};

type Alert = {
	sender_name: string;
	event: string;
	start: number;
	end: number;
	description: string;
	tags: string[];
};

type Current = {
	dt: number;
	sunrise?: number;
	sunset?: number;
	temp: number;
	feels_like: number;
	pressure: number;
	humidity: number;
	dew_point: number;
	uvi: number;
	clouds: number;
	rain?: Rain;
	visibility: number;
	wind_speed: number;
	wind_deg: number;
	wind_gust: number;
	weather: Weather[];
	pop?: number;
};

type Rain = {
	'1h': number;
};

type Weather = {
	id: number;
	main: string;
	description: string;
	icon: string;
};
