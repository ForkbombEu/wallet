<script lang="ts">
	import { goto } from '$app/navigation';
	import { BarcodeScanner, BarcodeFormat, LensFacing, type Barcode } from '@capacitor-mlkit/barcode-scanning';

	let barcode: Barcode;
	let isModalOpen: boolean;
	$: {
		if (barcode) {
			// verify that the url matches the verifier pattern
			isModalOpen = true;
			// goto("/r/verify");
		}
	}

	const stopScan = async () => {
		// Make all elements in the WebView visible again
		document.querySelector('body')?.classList.remove('barcode-scanner-active');

		// Remove all listeners
		await BarcodeScanner.removeAllListeners();

		// Stop the barcode scanner
		await BarcodeScanner.stopScan();
	};

	const scanSingleBarcode = async () => {
		await requestPermissions();
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
	const scan = () => {
		scanSingleBarcode().then((result) => (barcode = result as Barcode));
	};
	const checkPermissions = async () => {
		const { camera } = await BarcodeScanner.checkPermissions();
		return camera;
	};

	const requestPermissions = async () => {
		console.log('Requesting permissions');
		const { camera } = await BarcodeScanner.requestPermissions();
		console.log(camera);
		return camera;
	};
	const closeModal = () => (isModalOpen = false);
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
			<ion-button color="primary" expand="block" on:keydown={scan} on:click={scan} aria-hidden
				>Scan Single Barcode</ion-button
			>
			<!-- {barcode.displayValue} -->
		</ion-card-content>
	</ion-card>
	<ion-modal is-open={isModalOpen} initial-breakpoint={0.25} backdrop-dismiss={false} backdrop-breakpoint={0.5}>
		<ion-content class="ion-padding">
			<ion-toolbar>
				<ion-title>Over 18</ion-title>
				<ion-buttons slot="end">
					<ion-button color="light" on:click={closeModal} on:keydown={closeModal} aria-hidden> Close </ion-button>
				</ion-buttons>
			</ion-toolbar>
			<div class="ion-margin-top">
				<ion-label>Issued by Italian governament.</ion-label>
			</div>
		</ion-content>
	</ion-modal>
</ion-content>
