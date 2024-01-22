<script lang="ts">
	import { goto } from '$app/navigation';
	import Modal from '$lib/components/molecules/Modal.svelte';
	import Scanner from '$lib/components/organisms/scanner/Scanner.svelte';
	import { parseQr } from '$lib/components/organisms/scanner/tools';
	import type { Barcode } from '@capacitor-mlkit/barcode-scanning';

	let barcode: Barcode;
	let isModalOpen: boolean;

	const request = () => {
		isModalOpen = false;
		goto('/r/request');
	};
</script>

<Scanner
	let:scan
	on:success={(e) => {
		barcode = e.detail.qr;
		isModalOpen = true;
	}}
>
	
		<Modal {isModalOpen} closeCb={scan}>
			{@const parsedQr = parseQr(barcode?.rawValue)}
			{#if !(parsedQr?.result === 'ok')}
				<ion-title>{parsedQr?.message || 'error'}</ion-title>
			{:else}
				{@const { name, issuedBy, url } = parsedQr.credential}
				<ion-title>{name}</ion-title>
				<ion-label>{issuedBy}</ion-label>
				<br />
				<ion-button on:click={request} on:keydown={request} aria-hidden>Get this credential</ion-button>
			{/if}
		</Modal>
</Scanner>
