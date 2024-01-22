<script lang="ts">
	import { goto } from '$app/navigation';
	import Modal from '$lib/components/molecules/Modal.svelte';
	import Scanner from '$lib/components/organisms/scanner/Scanner.svelte';
	import { parseQr, verifyCredential, type Credential } from '$lib/components/organisms/scanner/tools';

	let barcode: string;
	let isModalOpen: boolean;
	let res:any

	const request = async (credential:Credential) => {
		// isModalOpen = false;
		res = "ccccc"
		res = await verifyCredential(credential)
	};
</script>

<Scanner
	let:scan
	on:success={(e) => {
		barcode = e.detail.qr;
		isModalOpen = true;
	}}
>
	
<!-- {JSON.stringify(res)} -->
		<Modal {isModalOpen} closeCb={scan}>
			{@const parsedQr = parseQr(barcode)}
			{#if !(parsedQr?.result === 'ok')}
				<ion-title>{parsedQr?.message || 'error'}</ion-title>
				<!-- {barcode} -->
			{:else}
				{@const { name, issuedBy, url } = parsedQr.credential}
				<ion-title>{name}</ion-title>
				<ion-label>{issuedBy}</ion-label>
				<br />
				<ion-button on:click={()=>request(parsedQr.credential)} on:keydown={()=>request(parsedQr.credential)} aria-hidden>Verify</ion-button>
			{/if}
			
		</Modal>
</Scanner>
