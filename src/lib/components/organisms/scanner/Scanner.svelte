<script lang="ts">
	import { BarcodeScanner, type Barcode } from '@capacitor-mlkit/barcode-scanning';
	import { close } from 'ionicons/icons';
	import { createEventDispatcher } from 'svelte';
	import { m } from '$lib/i18n';
	import camera from '$lib/assets/camera.png';
	import { Capacitor } from '@capacitor/core';
	import { tweened } from 'svelte/motion';
	import { quartInOut } from 'svelte/easing';
	import { NativeSettings, AndroidSettings, IOSSettings } from 'capacitor-native-settings';
	import { arrowForwardOutline } from 'ionicons/icons';
	import { invalidateAll } from '$app/navigation';
	import FingerPrint from '$lib/assets/lottieFingerPrint/FingerPrint.svelte';

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
		let allowed = await checkPermissions();
		if (allowed !== 'granted') {
			allowed = await requestPermissions();
			permissionsGranted = allowed === 'granted';
		} else {
			permissionsGranted = true;
		}
		if (permissionsGranted) {
			scan();
		}
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

	//

	document.addEventListener('ionBackButton', (ev: any) => {
		ev.detail.register(5, (processNextHandler: () => {}) => {
			stopScan();
			processNextHandler();
		});
	});

	//

	const translateY = tweened(-138, { duration: 2000, easing: quartInOut });
	$: if ($translateY === -138) translateY.set(+135);
	$: if ($translateY === +135) translateY.set(-138);

	//

	const openSettings = async () => {
		await NativeSettings.open({
			optionAndroid: AndroidSettings.ApplicationDetails,
			optionIOS: IOSSettings.App
		});
		await invalidateAll();
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
				<FingerPrint />
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
					<d-text size="l" class="text-center text-white">
						{m.To_scan_QR_codes_allow_us_to_use_your_camera_in_Settings()}
					</d-text>
					<d-button expand on:click={openSettings} on:keydown={openSettings} aria-hidden>
						NOTIFICATIONS SETTINGS <ion-icon slot="end" icon={arrowForwardOutline} />
					</d-button>
				</div>
			{:else}
				<slot {scan} {stopScan} />
				<div
					class="visible fixed left-0 top-0 z-40 flex h-screen w-full flex-col items-center justify-center"
				>
					<div class="viewfinderBg min-h-24 w-full flex-grow" />
					<div class="flex h-72 w-full">
						<div class="max-w-1/4 viewfinderBg h-full flex-grow" />
						<div
							class="viewfinder relative z-50 h-72 w-72 overflow-hidden rounded-md bg-transparent"
						>
							<div class="absolute left-0 top-0 h-full w-full border-8 border-white"></div>
							<div
								class="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 transform bg-white"
								style="transform: translateY({$translateY}px)"
							></div>
						</div>
						<div class="viewfinderBg h-full flex-grow" />
					</div>

					<div class="viewfinderBg w-full flex-grow">
						<div class="ion-padding">
							<d-page-description
								title={m.Scan_QR_to_verify_or_obtain_credentials_()}
								description={m.Make_sure_to_scan_the_full_QR_surface_()}
							/>
						</div>
					</div>
				</div>
			{/if}
		{/await}
	{:else}
		<div class="flex flex-col gap-4 px-8 pt-16">
			<d-text size="l">Insert a valid JSON here</d-text>
			<textarea bind:value={inputText} class="h-80 w-full p-4 text-primary" />
			<d-button on:click={submitJson} on:keydown={submitJson} aria-hidden>
				{m.Submit()}
			</d-button>
		</div>
		<slot {scan} {stopScan} />
	{/if}
</ion-content>

<style>
	.viewfinder {
		--s: 50px;
		--t: 8px;

		padding: calc(var(--t));
		outline-offset: calc(-1 * var(--t));
		mask:
			conic-gradient(at var(--s) var(--s), #0000 75%, #000 0) 0 0 / calc(100% - var(--s))
				calc(100% - var(--s)),
			linear-gradient(#000 0 0) content-box;
	}

	.viewfinderBg {
		@apply bg-[#d2d7e5] bg-opacity-70;
	}
</style>
