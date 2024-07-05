<script lang="ts">
	import '@fontsource-variable/gantari';
	import { setupIonicBase } from 'ionic-svelte';

	setupIonicBase();

	import 'ionic-svelte/components/all';
	import '../theme/custom.css';
	import '../theme/variables.css';

	import { i18n, r } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-js-adapter-sveltekit';
	import HiddenLogsButton from '$lib/components/molecules/HiddenLogsButton.svelte';
	import { log } from '$lib/log';
	import { routeHistory } from '$lib/routeStore';
	import { onDestroy, onMount } from 'svelte';
	import { navigating } from '$app/stores';
	import Loading from '$lib/components/molecules/Loading.svelte';
	import { App } from '@capacitor/app';
	const controller = new AbortController();
	const signal = controller.signal;

	onMount(() => {
		document.addEventListener(
			'ionBackButton',
			(ev: any) => {
				ev.detail.register(-1, () => {
					if (isExitPoint()) App.exitApp();
					else routeHistory.back();
				});

				const isExitPoint = () => {
					const exitPoints = [r('/home'), r('/login')];
					return exitPoints.includes(window.location.pathname);
				};
			},
			{ signal }
		);
	});
	onDestroy(() => {
		controller.abort();
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
		src="https://cdn.jsdelivr.net/npm/@didroom/components@1.24/dist/didroom-components/didroom-components.esm.js"
	></script>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/@didroom/components@1.24/dist/didroom-components/didroom-components.css"
	/>
</svelte:head>
<svelte:window
	on:error|capture={(e) => log(e.error)}
	on:unhandledrejection|capture={(e) => log(e.reason)}
/>
<ParaglideJS {i18n}>
	<HiddenLogsButton />
	<ion-app>
		{#if $navigating}
			<div class="m-8">
				<Loading />
			</div>
		{:else}
			<slot />
		{/if}
	</ion-app>
</ParaglideJS>
