import type { Forecast } from '$lib/types';
import { writable } from 'svelte/store';

export const forecastStore = writable<Forecast | undefined>(undefined);
