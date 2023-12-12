export const floorToDecimalPlaces = (input: number, decimals: number) => {
	return Math.floor(input * Math.pow(10, decimals)) / Math.pow(10, decimals);
};
