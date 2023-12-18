import type { Grade } from './types';

export const colour = {
	// indigo-600
	darkBlue: '#4f46e5',

	// sky-500
	lightBlue: '#0ea5e9',

	// orange-500
	orange: '#f97316',

	// red-600
	red: '#dc2626',

	// green-500
	green: '#22c55e',

	// yellow-300
	yellow: '#fde047'
} as const;

export const getColourForGrade = (rating: Grade) => {
	if (rating === 'safe') return colour.green;
	if (rating === 'warning') return colour.yellow;
	if (rating === 'danger') return colour.orange;
	return colour.red;
};
