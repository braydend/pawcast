<script lang="ts">
	import Locate from '$lib/icons/Locate.svelte';

	export let onLocationChange: (newLocation: { lat: number; long: number }) => void;
	export let locationName: string;

	const handleLocate = () => {
		navigator.geolocation.getCurrentPosition(
			async (pos) => {
				onLocationChange({ lat: pos.coords.latitude, long: pos.coords.longitude });
			},
			(locateError) => {
				console.error(locateError);
			}
		);
	};
</script>

<div class="container">
	<button on:click={handleLocate}>
		<Locate />
	</button>
	<span>{locationName}</span>
</div>

<style>
	.container {
		grid-column: 1 / span 2;
	}
</style>
