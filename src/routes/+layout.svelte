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
	import { onDestroy, onMount } from 'svelte';
	import { navigating } from '$app/stores';
	import { App } from '@capacitor/app';
	import { gotoQrResult } from '$lib/components/organisms/scanner/tools';
	import FingerPrint from '$lib/assets/lottieFingerPrint/FingerPrint.svelte';
	import { m } from '$lib/i18n';
	import { clearHttpStorage } from '$lib/utils';
	import { Network } from '@capacitor/network';
	import { debugDismiss, debugPopup, debugPopupContent } from '$lib/components/organisms/debug/debug';

	$: clearHttpStorage();

	const controller = new AbortController();
	const signal = controller.signal;

	let isConnected: boolean;

	const originalXhrOpen = XMLHttpRequest.prototype.open;
	const originalXhrSend = XMLHttpRequest.prototype.send;

	// @ts-ignore
	XMLHttpRequest.prototype.open = async function (method, url, ...rest) {
		// @ts-ignore
		this._url = url;
		// @ts-ignore
		this._method = method;
		debugPopupContent.push(`XMLHttpRequest Opened: ${method} ${url}`);
		debugPopup.set(true);

		// @ts-ignore
		return originalXhrOpen.apply(this, [method, url, ...rest]);
	};

	XMLHttpRequest.prototype.send = function (body) {
		debugPopupContent.push(
			// @ts-ignore
			`XMLHttpRequest Sent: ${JSON.stringify({ method: this._method, url: this._url, body }, null, 2)}`
		);
		debugPopup.set(true);
		this.addEventListener('load', async function () {
			debugPopupContent.push(
				// @ts-ignore
				`XMLHttpRequest Response from ${this._url}: ${JSON.stringify(this.responseText, null, 2)}`
			);
			debugPopup.set(true);
		});
		return originalXhrSend.apply(this, [body]);
	};

	onMount(async () => {
		isConnected = (await Network.getStatus()).connected;
		Network.addListener('networkStatusChange', (status) => {
			isConnected = status.connected;
		});
		document.addEventListener(
			'ionBackButton',
			(ev: any) => {
				ev.detail.register(-1, () => {
					if (isExitPoint()) App.exitApp();
					else if (r('/unlock') === window.location.pathname) return;
					else if (isBackLockedPoint()) return (window.location.href = r('/home'));
					else window.history.back();
				});

				const isBackLockedPoint = () => {
					const backLockedPoints = [r('/verification'), r('/verification/results')];
					return backLockedPoints.includes(window.location.pathname);
				};

				const isExitPoint = () => {
					const exitPoints = [r('/home'), r('/register-login')];
					return exitPoints.includes(window.location.pathname);
				};
			},
			{ signal }
		);

		App.addListener('appUrlOpen', async (data) => {
			await gotoQrResult(data.url);
		});
	});
	onDestroy(() => {
		controller.abort();
	});
</script>

<svelte:head>
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0, user-scalable=no"
	/>
	<!-- uncomment to test didroom-components locally -->
	<!-- <script 
	 	type="module" 
	 	src="http://localhost:3333/build/didroom-components.esm.js" 
	 ></script> 
	 <link 
	 	rel="stylesheet" 
	 	href="http://localhost:3333/build/didroom-components.css" 
	 />  -->
	<script type="module" src="/components/didroom-components/didroom-components.esm.js"></script>
	<link rel="stylesheet" href="/components/didroom-components/didroom-components.css" />
	<title>{m.DidroomWallet()}</title>
</svelte:head>
<svelte:window
	on:error|capture={(e) => log(e.error)}
	on:unhandledrejection|capture={(e) => log(e.reason)}
/>
<ParaglideJS {i18n}>
	<HiddenLogsButton />
	<ion-app class="mx-auto max-w-3xl">
		<d-loading loading={$navigating || !isConnected}>
			<FingerPrint />
			{#if !isConnected}
				<d-vertical-stack class="ion-padding" gap={8}>
					<d-text size="xl"
						>{m.It_seems_that_the_wallet_is_unable_to_connect_to_the_Internet_please_make_sure_your_internet_connection_is_working_and_retry()}</d-text
					>
					<d-button color="accent" on:click={() => App.exitApp()} aria-hidden expand
						>{m.Close()}</d-button
					>
				</d-vertical-stack>
			{/if}
		</d-loading>
		<slot />
	</ion-app>
</ParaglideJS>
