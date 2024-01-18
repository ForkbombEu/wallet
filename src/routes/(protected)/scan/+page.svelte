<script lang="ts">
	import { goto } from '$app/navigation';
	import { BarcodeScanner, type Barcode } from '@capacitor-mlkit/barcode-scanning';
	import { chevronBackOutline } from 'ionicons/icons';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let barcode: Barcode;
	let isModalOpen: boolean;
	let randomNumber: number;

	const fakeResponse = () => {
		randomNumber = Math.floor(Math.random() * 3);
	};
	onMount(async () => {
		scan();
	});

	const stopScan = async () => {
		// Make all elements in the WebView visible again
		document.querySelector('body')?.classList.remove('barcode-scanner-active');

		// Remove all listeners
		await BarcodeScanner.removeAllListeners();

		// Stop the barcode scanner
		await BarcodeScanner.stopScan();

		goto('/home');
	};

	const scanSingleBarcode = async () => {
		const allowed = await checkPermissions();
		if (!allowed) await requestPermissions();
		return new Promise(async (resolve) => {
			document.querySelector('body')?.classList.add('barcode-scanner-active');
			// controls = 'visible';
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
	const closeModal = () => {
		isModalOpen = false;
		scan();
	};
	const openModal = () => (isModalOpen = true);
	const request = () => {
		isModalOpen = false;
		goto('/request');
	};
</script>

<ion-header class="visible">
	<ion-toolbar>
		<ion-buttons slot="start">
			<ion-back-button />
		</ion-buttons>
		<ion-title>Claim o verify credential</ion-title>
	</ion-toolbar>
</ion-header>

<ion-content>
	<div class={`visible w-full py-8`}>
		<ion-button on:click={stopScan} on:keydown={stopScan} aria-hidden class="opacity-50"
			><ion-icon icon={chevronBackOutline} slot="icon-only" /></ion-button
		>
	</div>
	<ion-modal
		is-open={isModalOpen}
		backdrop-dismiss={false}
		initial-breakpoint={0.6}
		backdrop-breakpoint={0.8}
		transition:fly
		class="visible"
	>
		<hr />
		<ion-content class="ion-padding visible">
			<ion-toolbar>
				<ion-title>Results</ion-title>
				<ion-buttons slot="end">
					<ion-button color="danger" on:click={closeModal} on:keydown={closeModal} aria-hidden>Close</ion-button>
				</ion-buttons>
			</ion-toolbar>
			{#if randomNumber == 0}
				<div class="mt-4 flex flex-col gap-2">
					<ion-title>Invalid</ion-title>
					<ion-label>Invalid qr code</ion-label>
				</div>
			{:else if randomNumber == 1}
				<div class="mt-4 flex flex-col gap-2">
					<ion-title>Over 18</ion-title>
					<ion-label>Issued by Italian governament.</ion-label>
					<br />
					<ion-button on:click={request} on:keydown={request} aria-hidden>Get this credential</ion-button>
				</div>
			{:else}
				<div class="mt-4 flex flex-col gap-2">
					<ion-title>Over 18</ion-title>
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
