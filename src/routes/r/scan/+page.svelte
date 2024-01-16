<script lang="ts">
	import { goto } from '$app/navigation';
	import { BarcodeScanner, type Barcode } from '@capacitor-mlkit/barcode-scanning';
	import { chevronBackOutline } from 'ionicons/icons';
	import { fly } from 'svelte/transition';

	let barcode: Barcode;
	let isModalOpen: boolean;
	let randomNumber: number = 0;
	let controls: 'hidden' | 'visible' = 'hidden';

	const fakeResponse = () => {
		randomNumber = Math.floor(Math.random() * 3);
	};

	const stopScan = async () => {
		// Make all elements in the WebView visible again
		document.querySelector('body')?.classList.remove('barcode-scanner-active');

		// Remove all listeners
		await BarcodeScanner.removeAllListeners();

		// Stop the barcode scanner
		await BarcodeScanner.stopScan();

		controls = "hidden"
	};

	const scanSingleBarcode = async () => {
		const allowed = await checkPermissions();
		if (!allowed) await requestPermissions();
		return new Promise(async (resolve) => {
			document.querySelector('body')?.classList.add('barcode-scanner-active');
			controls = 'visible';
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
		fakeResponse();
		scanSingleBarcode().then((result) => {
			barcode = result as Barcode;
			openModal();
		});
	};

	const checkPermissions = async () => {
		const { camera } = await BarcodeScanner.checkPermissions();
		return camera;
	};

	const requestPermissions = async () => {
		const { camera } = await BarcodeScanner.requestPermissions();
		return camera;
	};
	const closeModal = () => (isModalOpen = false);
	const openModal = () => (isModalOpen = true);
	const request = () => {
		isModalOpen = false;
		goto('/r/request');
	};
</script>

<ion-header>
	<ion-toolbar>
		<ion-buttons slot="start">
			<ion-back-button />
		</ion-buttons>
		<ion-title>Claim o verify credential</ion-title>
	</ion-toolbar>
</ion-header>

<ion-content>
	<div class={`${controls} w-full py-8`}>
		<ion-button on:click={stopScan} on:keydown={stopScan} aria-hidden class="opacity-50" 
			><ion-icon icon={chevronBackOutline} slot="icon-only" /></ion-button
		>
	</div>
	<ion-button color="primary" expand="block" on:keydown={scan} on:click={scan} aria-hidden>start scan</ion-button>
	<ion-modal
		is-open={isModalOpen}
		backdrop-dismiss={false}
		initial-breakpoint={0.6}
		backdrop-breakpoint={0.8}
		transition:fly
	>
		<ion-content class="ion-padding">
			<ion-toolbar>
				<ion-title>Results</ion-title>
				<ion-buttons slot="end">
					<ion-button color="danger" on:click={closeModal} on:keydown={closeModal} aria-hidden>Close</ion-button>
				</ion-buttons>
			</ion-toolbar>
			{#if (randomNumber = 0)}
				<div class="ion-margin-top">
					<ion-label>Invalid</ion-label>
					<ion-label>Invalid qr code</ion-label>
				</div>
			{:else if (randomNumber = 1)}
				<div class="ion-margin-top">
					<ion-label>Over 18</ion-label>
					<ion-label>Issued by Italian governament.</ion-label>
					<br />
					<ion-button on:click={request} on:keydown={request} aria-hidden>Get this credential</ion-button>
					<!-- <pre>{JSON.stringify(barcode, null, 2)}</pre> -->
				</div>
			{:else}
				<div class="ion-margin-top">
					<ion-label>Over 18</ion-label>
					<ion-label>Issued by Italian governament.</ion-label>
					<ion-label>Ready for verification</ion-label>
					<br />
					<ion-button>Confirm</ion-button>
					<!-- <pre>{JSON.stringify(barcode, null, 2)}</pre> -->
				</div>
			{/if}
		</ion-content>
	</ion-modal>
</ion-content>
