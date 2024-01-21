<script lang="ts">
	import { goto } from '$app/navigation';
	import Modal from '$lib/components/molecules/Modal.svelte';
	import Scanner from '$lib/components/organisms/scanner/Scanner.svelte';
	import type { Barcode } from '@capacitor-mlkit/barcode-scanning';

	let barcode: Barcode;
	let isModalOpen: boolean;

	const request = () => {
		isModalOpen = false;
		goto('/r/request');
	};
</script>

<Scanner let:scan>
	<ion-header class="visible">
		<ion-toolbar>
			<ion-buttons slot="start">
				<ion-back-button />
			</ion-buttons>
			<ion-title>Claim o verify credential</ion-title>
		</ion-toolbar>
	</ion-header>

	<ion-content>
		<Modal {isModalOpen} closeCb={scan}>
			<ion-title>Over 18</ion-title>
			<ion-label>Issued by Italian governament.</ion-label>
			<br />
			<pre>{JSON.stringify(barcode?.rawValue, null, 2)}</pre>
			<ion-button on:click={request} on:keydown={request} aria-hidden>Get this credential</ion-button>
		</Modal>
	</ion-content>
</Scanner>
