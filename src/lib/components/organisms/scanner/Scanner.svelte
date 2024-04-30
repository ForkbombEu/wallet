<script lang="ts">
	import { BarcodeScanner, type Barcode } from '@capacitor-mlkit/barcode-scanning';
	import { close } from 'ionicons/icons';
	import { createEventDispatcher } from 'svelte';
	import { m } from '$lib/i18n';
	import camera from '$lib/assets/camera.png';
	import { Capacitor } from '@capacitor/core';

	const dispatch = createEventDispatcher();
	const qrCodeScanned = (barcode: Barcode) => {
		dispatch('success', {
			qr: barcode.displayValue
		});
	};
	const stopScan = async () => {
		await BarcodeScanner.removeAllListeners();
		await BarcodeScanner.stopScan();
		document.querySelector('body')?.classList.remove('barcode-scanner-active');
		window.history.back();
	};

	const scanSingleBarcode = async () => {
		return new Promise(async (resolve) => {
			document.querySelector('body')?.classList.add('barcode-scanner-active');
			const listener = await BarcodeScanner.addListener('barcodeScanned', async (result) => {
				await listener.remove();
				document.querySelector('body')?.classList.remove('barcode-scanner-active');
				await BarcodeScanner.stopScan();
				resolve(result.barcode);
			});

			await BarcodeScanner.startScan(); //
		});
	};
	const scan = async () => {
		const barcode = await scanSingleBarcode();
		qrCodeScanned(barcode as Barcode);
	};

	const checkPermissions = async () => {
		const { camera } = await BarcodeScanner.checkPermissions();
		return camera;
	};

	const requestPermissions = async () => {
		const { camera } = await BarcodeScanner.requestPermissions();
		return camera;
	};
	const awaitPermissions = async () => {
		let permissionsGranted: boolean;
		const allowed = await checkPermissions();
		if (allowed == 'denied') {
			permissionsGranted = false;
			const permissions = await requestPermissions();
			if (permissions !== 'denied') permissionsGranted = true;
		} else {
			permissionsGranted = true;
		}
		permissionsGranted && scan();
		return permissionsGranted;
	};

	//to test on web
	const isWeb = Capacitor.getPlatform() == 'web';
	let inputText: string;
	const submitJson = () => {
		dispatch('success', {
			qr: inputText
		});
	};
</script>

<ion-header class="visible bg-[#d2d7e5]">
	<ion-toolbar>
		<div class="flex flex-row">
			<ion-title>{m.QR_SCAN()}</ion-title>
			<d-button on:click={stopScan} on:keydown={stopScan} aria-hidden clear>
				<ion-icon icon={close} slot="icon-only" class="text-on"></ion-icon>
			</d-button>
		</div>
	</ion-toolbar>
</ion-header>

<ion-content>
	{#if !isWeb}
		{#await awaitPermissions()}
			<div class="flex h-full w-full items-center justify-center">
				<ion-spinner />
			</div>
		{:then permissionsGranted}
			{#if !permissionsGranted}
				<div
					class="visible flex h-full w-full flex-col items-center justify-center gap-4 bg-black px-4 text-white"
				>
					<img alt="No camera permissions allowed" src={camera} />
					<d-heading size="s">
						<h2 class="text-white">{m.No_camera_access()}</h2>
					</d-heading>
					<d-text size="l" class="text-white">
						{m.To_scan_QR_codes_allow_us_to_use_your_camera_in_Settings()}
					</d-text>
				</div>
			{:else}
				<slot {scan} {stopScan} />
				<div class="visible absolute bottom-0 flex h-48 flex-col gap-2 bg-[#d2d7e5] px-4 pt-4">
					<d-heading size="s">
						<h2>{m.Scan_QR_to_verify_or_obtain_credentials_()}</h2>
					</d-heading>
					<d-text size="l">
						<p class="pb-4">{m.Make_sure_to_scan_the_full_QR_surface_()}</p></d-text
					>
				</div>
			{/if}
		{/await}
	{:else}
		<div class="flex flex-col gap-4 px-8 pt-16">
			<d-text size="l">Insert a valid JSON here</d-text>
			<textarea bind:value={inputText} class="h-80 w-full text-primary p-4" />
			<d-button on:click={submitJson} on:keydown={submitJson} aria-hidden>
				{m.Submit()}
			</d-button>
		</div>
		<slot {scan} {stopScan}/>
	{/if}
</ion-content>
