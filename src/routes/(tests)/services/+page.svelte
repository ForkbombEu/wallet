<script lang="ts">
	import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
	import { qrCodeOutline } from 'ionicons/icons';
	export let qr: any = '';

	const scan = async () => {
		return new Promise(async (resolve) => {
			document.querySelector('body')?.classList.add('barcode-scanner-active');

			const listener = await BarcodeScanner.addListener('barcodeScanned', async (result) => {
				await listener.remove();
				document.querySelector('body')?.classList.remove('barcode-scanner-active');
				await BarcodeScanner.stopScan();
				resolve(result.barcode.rawValue);
			});

			await BarcodeScanner.startScan();
		});
	};
</script>

<ion-tab tab="services">
	<ion-header translucent={true}>
		<ion-toolbar>
			<ion-buttons slot="start">
				<ion-menu-button />
			</ion-buttons>
			<ion-title>QR Scanner</ion-title>
		</ion-toolbar>
	</ion-header>

	<ion-content fullscreen class="ion-padding">
		<h1 class="mb-10 text-3xl font-bold">Fastest QR reader of the East!</h1>
		<p class="mb-10 text-xl">Result is:</p>
		<p class="text-lg">{qr}</p>
		<ion-fab vertical="bottom" horizontal="center" slot="fixed">
			<ion-fab-button
				role="button"
				tabindex="0"
				on:click={async () => {
					qr = await scan();
				}}
				on:keypress={(e) => {
					if (e.key === 'Enter') scan();
				}}
			>
				<ion-icon icon={qrCodeOutline} />
			</ion-fab-button>
		</ion-fab>
	</ion-content>
</ion-tab>
