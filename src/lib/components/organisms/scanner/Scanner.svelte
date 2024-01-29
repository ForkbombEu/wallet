<script lang="ts">
	import { BarcodeScanner, type Barcode } from '@capacitor-mlkit/barcode-scanning';
	import { close } from 'ionicons/icons';
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();
	const qrCodeScanned = (barcode: Barcode) => {
		dispatch('success', {
			qr: barcode.displayValue
		});
	};

	onMount(() => {
		scan();
	});

	const stopScan = async () => {
		await BarcodeScanner.removeAllListeners();
		await BarcodeScanner.stopScan();
		document.querySelector('body')?.classList.remove('barcode-scanner-active');
		window.history.back();
	};

	const scanSingleBarcode = async () => {
		const allowed = await checkPermissions();
		if (!allowed) await requestPermissions();
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
</script>

<ion-header class="visible bg-[#d2d7e5]">
	<ion-toolbar>
		<div class="flex flex-row">
			<ion-title>QR SCAN</ion-title>
			<ion-button tab="account" on:click={stopScan} on:keydown={stopScan} aria-hidden fill="clear">
				<ion-icon icon={close}></ion-icon>
			</ion-button>
		</div>
	</ion-toolbar>
</ion-header>

<ion-content>
	<slot {scan} {stopScan} />
	<div class="visible fixed bottom-0 h-48 mb-[-70px] px-4 bg-[#d2d7e5] flex flex-col gap-2">
		<d-heading size="s">
			<h2>Scan QR to verify or obtain credentials...</h2>
		</d-heading>
		<d-text size="l"> <p class="pb-4">Make sure to scan the full QR surface...</p></d-text>
	</div>
</ion-content>
