<script lang="ts">
	import { dev } from '$app/environment';
	import '../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
</script>

<svelte:head>
	{#if !dev}
		<script defer data-domain="pawcast.app" src="https://plausible.io/js/script.js"></script>
	{/if}
</svelte:head>

<ModeWatcher />
<slot></slot>
