<script lang="ts">
	import { setupIonicBase } from 'ionic-svelte';

	setupIonicBase();

	import '@fontsource/poppins';
	import 'ionic-svelte/components/all';
	import '../theme/variables.css';
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0" />
	<script
		type="module"
		src="https://cdn.jsdelivr.net/npm/@didroom/components/dist/didroom-components/didroom-components.esm.js"
	></script>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/@didroom/components/dist/didroom-components/didroom-components.css"
	/>
</svelte:head>

<ion-app>
	<slot />
</ion-app>
