<script lang="ts">
	import { goto } from '$app/navigation';
	import Modal from '$lib/components/molecules/Modal.svelte';
	import Scanner from '$lib/components/organisms/scanner/Scanner.svelte';
	import {
		parseQr,
		verifyCredential,
		type Credential,
		type ParseQrResults
	} from '$lib/components/organisms/scanner/tools';
	import { m } from '$lib/i18n';

	let barcodeResult: ParseQrResults;
	let isModalOpen: boolean;
	let res: any;

	const request = async (credential: Credential) => {
		res = await verifyCredential(credential);
	};

</script>
<Scanner
	let:scan
	on:success={async (e) => {
		barcodeResult = parseQr(e.detail.qr);
		if (barcodeResult.result === 'ok' && barcodeResult.data.type === 'service') {
			return await goto(
				`/credential-offer-test?service=${encodeURI(JSON.stringify(barcodeResult.data.service))}`
			);
		}
		isModalOpen = true;
	}}
>
	<Modal {isModalOpen} closeCb={scan}>
		{#if !(barcodeResult?.result === 'ok')}
			<ion-title>{barcodeResult?.message || 'error'}</ion-title>
		{:else if barcodeResult.data.type === 'credential'}
			{@const credential = barcodeResult.data.credential}
			{@const { name, issuedBy, url } = credential}
			<ion-title>{name}</ion-title>
			<ion-label>{issuedBy}</ion-label>
			<br />
			<ion-button
				on:click={() => request(credential)}
				on:keydown={() => request(credential)}
				aria-hidden>{m.Verify()}</ion-button
			>
		{/if}
	</Modal>
</Scanner>
