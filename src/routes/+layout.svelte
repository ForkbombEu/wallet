<script lang="ts">
	import { setupIonicBase } from 'ionic-svelte';
	import '@fontsource-variable/gantari';

	setupIonicBase();

	import 'ionic-svelte/components/all';
	import '../theme/variables.css';
	import '../theme/custom.css';

	import { ParaglideJS } from '@inlang/paraglide-js-adapter-sveltekit';
	import { i18n } from '$lib/i18n';
</script>

<svelte:head>
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0"
	/>
	<script
		type="module"
		src="https://cdn.jsdelivr.net/npm/@didroom/components@1.13/dist/didroom-components/didroom-components.esm.js"
	></script>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/@didroom/components@1.13/dist/didroom-components/didroom-components.css"
	/>
</svelte:head>

<ParaglideJS {i18n}>
	<ion-app>
		<slot />
	</ion-app>
</ParaglideJS>
