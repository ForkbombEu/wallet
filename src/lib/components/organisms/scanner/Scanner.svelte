<script lang="ts">
	import { BarcodeScanner, type Barcode } from '@capacitor-mlkit/barcode-scanning';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { m } from '$lib/i18n';
	import camera from '$lib/assets/camera.png';
	import { Capacitor } from '@capacitor/core';
	import { NativeSettings, AndroidSettings, IOSSettings } from 'capacitor-native-settings';
	import { arrowForwardOutline } from 'ionicons/icons';
	import { invalidateAll } from '$app/navigation';
	import FingerPrint from '$lib/assets/lottieFingerPrint/FingerPrint.svelte';
	const controller = new AbortController();
	const signal = controller.signal;

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
		controller.abort();
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

	onMount(() => {
		document.addEventListener('ionBackButton', (ev: any) => {
			ev.detail.register(2, (processNextHandler:()=>void) => {
				stopScan();
				processNextHandler();
			});
		}),
			{ signal };
	});
	onDestroy(() => {
		document.querySelector('body')?.classList.remove('barcode-scanner-active');
		controller.abort();
	});

	//

	const openSettings = async () => {
		await NativeSettings.open({
			optionAndroid: AndroidSettings.ApplicationDetails,
			optionIOS: IOSSettings.App
		});
		await invalidateAll();
	};
	const closeScanner = async () => {

		await stopScan();
		window.history.back();
	};
</script>


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
						{m.NOTIFICATIONS_SETTINGS()} <ion-icon slot="end" icon={arrowForwardOutline} />
					</d-button>
				</div>
			{:else}
				<slot {scan} {stopScan} />
				<d-scanner-mask
					class="visible z-40"
					heading={m.Scan_QR_to_verify_or_obtain_credentials_()}
					description={m.Make_sure_to_scan_the_full_QR_surface_()}
					on:cancelClick={closeScanner}
				/>
			{/if}
		{/await}
	{:else}
		<div class="flex flex-col gap-4 px-8 pt-16">
			<d-text size="l">{m.Insert_a_valid_intent_url_here()}</d-text>
			<textarea bind:value={inputText} class="h-80 w-full p-4 text-primary" />
			<d-button on:click={submitJson} on:keydown={submitJson} aria-hidden>
				{m.Submit()}
			</d-button>
		</div>
		<slot {scan} {stopScan} />
	{/if}
</ion-content>

