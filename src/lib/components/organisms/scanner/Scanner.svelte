<script lang="ts">
	import { BarcodeScanner, type Barcode } from '@capacitor-mlkit/barcode-scanning';
	import { chevronBackOutline } from 'ionicons/icons';
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
		// Make all elements in the WebView visible again
        
		// Remove all listeners
		await BarcodeScanner.removeAllListeners();
        
		// Stop the barcode scanner
		await BarcodeScanner.stopScan();
        
		document.querySelector('body')?.classList.remove('barcode-scanner-active');
		// goto("/r/home")
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

<div class={`visible w-full fixed top-20 px-6 flex flex-row justify-between`}>
	<ion-button on:click={stopScan} on:keydown={stopScan} aria-hidden class="opacity-50"
		><ion-icon icon={chevronBackOutline} slot="icon-only" /></ion-button
	>
</div>
<slot {scan} {stopScan} />
