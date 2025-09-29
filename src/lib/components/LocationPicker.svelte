<script lang="ts">
	import Locate from '$lib/icons/Locate.svelte';
	import Button from '$lib/shadcn/ui/button/button.svelte';
	import Input from '$lib/shadcn/ui/input/input.svelte';

	interface Props {
		onLocationChange: (newLocation: { lat: number; long: number }) => void;
		locationName: string;
	}

	let { onLocationChange, locationName = $bindable() }: Props = $props();

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

<form class="flex w-full max-w-sm items-center space-x-2 col-start-1 col-end-3">	
	<Button on:click={handleLocate}>
		<Locate />
	</Button>
	<Input type="text" placeholder="Select a location" bind:value={locationName} disabled />
</form>
