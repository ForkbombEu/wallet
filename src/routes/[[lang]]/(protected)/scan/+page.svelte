<script lang="ts">
	import Modal from '$lib/components/molecules/Modal.svelte';
	import Scanner from '$lib/components/organisms/scanner/Scanner.svelte';
	import { parseQr, type ParseQrResults } from '$lib/components/organisms/scanner/tools';
	import { credentialOfferStore } from '$lib/credentialOfferStore';
	import { goto, m } from '$lib/i18n';
	import { routeHistory } from '$lib/routeStore';
	import { verificationStore } from '$lib/verificationStore';
	import { Capacitor } from '@capacitor/core';

	let barcodeResult: ParseQrResults;
	let isModalOpen: boolean;
	const isWeb = Capacitor.getPlatform() == 'web';

	const parseBareCodeResultErrors = (barcodeResultMessage:string)=> {
		console.log(barcodeResultMessage);
		if (barcodeResultMessage.includes('QR code is expired')) {
			return m.QR_code_is_expired();
		}
		if (barcodeResultMessage.includes('no_signed_selective_disclosure_found_that_matched_the_requested_claims')) {
			return m.You_have_no_signed_selective_disclosure_that_matched_the_requested_claims_or_your_credential_is_expired();
		}
		return barcodeResultMessage
	}
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
		routeHistory.push({ previousPath: '/scan' });
		return (isModalOpen = true);
	}}
>
	<Modal
		{isModalOpen}
		closeCb={() => {
			isModalOpen = false;
			routeHistory.back();
			if (!isWeb) scan();
		}}
		textToCopy={barcodeResult?.message}
	>
		{#if !(barcodeResult?.result === 'ok')}
			<d-text size="m">{parseBareCodeResultErrors(barcodeResult?.message || 'error')}</d-text>
		{/if}
	</Modal>
</Scanner>
