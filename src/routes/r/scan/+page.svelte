<script lang="ts">
	import { BarcodeScanner, BarcodeFormat, LensFacing, type Barcode } from '@capacitor-mlkit/barcode-scanning';

    let barcodes:Barcode[]
	const startScan = async () => {
		await requestPermissions()
		// The camera is visible behind the WebView, so that you can customize the UI in the WebView.
		// However, this means that you have to hide all elements that should not be visible.
		// You can find an example in our demo repository.
		// In this case we set a class `barcode-scanner-active`, which then contains certain CSS rules for our app.
		document.querySelector('body')?.classList.add('barcode-scanner-active');

		// Add the `barcodeScanned` listener
		const listener = await BarcodeScanner.addListener('barcodeScanned', async (result) => {
			console.log(result.barcode);
            barcodes.push(result.barcode);
		});

		// Start the barcode scanner
		await BarcodeScanner.startScan();
	};

	const stopScan = async () => {
		// Make all elements in the WebView visible again
		document.querySelector('body')?.classList.remove('barcode-scanner-active');

		// Remove all listeners
		await BarcodeScanner.removeAllListeners();

		// Stop the barcode scanner
		await BarcodeScanner.stopScan();
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

			await BarcodeScanner.startScan();
		});
	};

	const scan = async () => {
		const { barcodes } = await BarcodeScanner.scan({
			formats: [BarcodeFormat.QrCode]
			// lensFacing: LensFacing.Back,
		});
		return barcodes;
	};

	const isSupported = async () => {
		const { supported } = await BarcodeScanner.isSupported();
		return supported;
	};

	const enableTorch = async () => {
		await BarcodeScanner.enableTorch();
	};

	const disableTorch = async () => {
		await BarcodeScanner.disableTorch();
	};

	const toggleTorch = async () => {
		await BarcodeScanner.toggleTorch();
	};

	const isTorchEnabled = async () => {
		const { enabled } = await BarcodeScanner.isTorchEnabled();
		return enabled;
	};

	const isTorchAvailable = async () => {
		const { available } = await BarcodeScanner.isTorchAvailable();
		return available;
	};

	const openSettings = async () => {
		await BarcodeScanner.openSettings();
	};

	const isGoogleBarcodeScannerModuleAvailable = async () => {
		const { available } = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
		return available;
	};

	const installGoogleBarcodeScannerModule = async () => {
		await BarcodeScanner.installGoogleBarcodeScannerModule();
	};

	const checkPermissions = async () => {
		const { camera } = await BarcodeScanner.checkPermissions();
		return camera;
	};

	const requestPermissions = async () => {
		console.log("Requesting permissions")
		const { camera } = await BarcodeScanner.requestPermissions();
		console.log(camera)
		return camera;
	};
</script>

<ion-header>
	<ion-toolbar>
		<ion-buttons slot="start">
			<ion-back-button />
		</ion-buttons>
		<ion-title>Qrcode Scanning</ion-title>
	</ion-toolbar>
</ion-header>

<ion-content>
    <ion-card>
        <ion-card-content>
            <ion-button
            color="primary"
            expand="block"
            on:keydown={startScan}
            on:click={startScan}
            aria-hidden
            >Scan Single Barcode</ion-button>
        </ion-card-content>
    </ion-card>
</ion-content>
