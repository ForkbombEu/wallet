<script lang="ts">
	import { BarcodeScanner, type Barcode } from '@capacitor-mlkit/barcode-scanning';
	import { backspaceOutline, chevronBackOutline, refreshOutline, searchOutline } from 'ionicons/icons';
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

<ion-header class="visible bg-white">
	<ion-toolbar>
		<div class="flex flex-row">
			<ion-button tab="account" on:click={stopScan} on:keydown={stopScan} aria-hidden fill="clear">
				<ion-icon icon={backspaceOutline}></ion-icon>
			</ion-button>
			<ion-title>Claim o verify credential</ion-title>
		</div>
	</ion-toolbar>
</ion-header>

<ion-content>
	<slot {scan} {stopScan} />
</ion-content>
