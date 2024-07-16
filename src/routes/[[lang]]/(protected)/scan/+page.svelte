<script lang="ts">
	import Modal from '$lib/components/molecules/Modal.svelte';
	import Scanner from '$lib/components/organisms/scanner/Scanner.svelte';
	import { parseQr, type ParseQrResults } from '$lib/components/organisms/scanner/tools';
	import { credentialOfferStore } from '$lib/credentialOfferStore';
	import { goto } from '$lib/i18n';
	import { verificationStore } from '$lib/verificationStore';

	let barcodeResult: ParseQrResults;
	let isModalOpen: boolean;
</script>

<Scanner
	let:scan
	on:success={async (e) => {
		barcodeResult = await parseQr(e.detail.qr);
		if (barcodeResult.result === 'ok' && barcodeResult.data.type === 'service') {
			credentialOfferStore.set(barcodeResult.data.service);
			return await goto('/credential-offer');
		}
		if (barcodeResult.result === 'ok' && barcodeResult.data.type === 'credential') {
			verificationStore.set(barcodeResult.data.credential);
			return await goto('/verification');
		}
		isModalOpen = true;
	}}
>
	<Modal
		{isModalOpen}
		closeCb={() => {
			isModalOpen = false;
			scan();
		}}
		textToCopy={barcodeResult?.message}
	>
		{#if !(barcodeResult?.result === 'ok')}
			<d-text size="m">{barcodeResult?.message || 'error'}</d-text>
		{/if}
	</Modal>
</Scanner>
