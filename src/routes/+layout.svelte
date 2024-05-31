<script lang="ts">
	import '@fontsource-variable/gantari';
	import { setupIonicBase } from 'ionic-svelte';
	import { App } from '@capacitor/app';
	import { r } from '$lib/i18n';
	// import { BackButtonEvent } from '@ionic/core';

	setupIonicBase();

	import 'ionic-svelte/components/all';
	import '../theme/custom.css';
	import '../theme/variables.css';

	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-js-adapter-sveltekit';
	import HiddenLogsButton from '$lib/components/molecules/HiddenLogsButton.svelte';
	import { log } from '$lib/log';

	document.addEventListener('ionBackButton', (ev: any) => {
		ev.detail.register(-1, () => {
			const path = window.location.pathname;
			if (path === r('/home') || path === r('/login')) {
				App.exitApp();
			} else {
				window.history.back();
			}
		});
	});
</script>

<svelte:head>
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0"
	/>
	<!-- uncomment to test didroom-components locally -->
	<!-- <script
		type="module"
		src="http://localhost:3333/build/didroom-components.esm.js"
	></script>
	<link
		rel="stylesheet"
		href="http://localhost:3333/build/didroom-components.css"
	/> -->
	<script
		type="module"
		src="https://cdn.jsdelivr.net/npm/@didroom/components@1.20/dist/didroom-components/didroom-components.esm.js"
	></script>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/@didroom/components@1.20/dist/didroom-components/didroom-components.css"
	/>
</svelte:head>
<svelte:window
	on:error|capture={(e) => log(e.error)}
	on:unhandledrejection|capture={(e) => log(e.reason)}
/>
<ParaglideJS {i18n}>
	<HiddenLogsButton />
	<ion-app>
		<slot />
	</ion-app>
</ParaglideJS>
