<script lang="ts">
	import Modal from '$lib/components/molecules/Modal.svelte';
	import Scanner from '$lib/components/organisms/scanner/Scanner.svelte';
	import { gotoQrResult, parseQr, type ParseQrError } from '$lib/components/organisms/scanner/tools';
	import { m } from '$lib/i18n';
	import { Capacitor } from '@capacitor/core';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';

	let barcodeResult: ParseQrError | void;
	let isModalOpen: boolean
	const isWeb = Capacitor.getPlatform() == 'web';

	const parseBareCodeResultErrors = (barcodeResultMessage: string) => {
		console.log(barcodeResultMessage);
		if (barcodeResultMessage.includes('QR code is expired')) {
			return m.QR_code_is_expired();
		}
		if (
			barcodeResultMessage.includes(
				'no_signed_selective_disclosure_found_that_matched_the_requested_claims'
			)
		) {
			return m.You_have_no_signed_selective_disclosure_that_matched_the_requested_claims_or_your_credential_is_expired();
		}
		return barcodeResultMessage;
	};
	function showModal() {
		pushState('', {
			isModalOpen: true
		});
	}
</script>

<Scanner
	let:scan
	on:success={async (e) => {
		barcodeResult = parseQr(e.detail.qr)
		if (barcodeResult.message === 'not valid qr') {
			showModal();
			return (isModalOpen = true);
		}
		return await gotoQrResult(barcodeResult.message);
	}}
>
	<Modal
		isModalOpen={$page.state.isModalOpen}
		closeCb={() => {
			window.history.back();
			if (!isWeb) scan();
		}}
		textToCopy={barcodeResult?.message}
	>
		<d-text size="m">{parseBareCodeResultErrors(barcodeResult?.message || 'error')}</d-text>
	</Modal>
</Scanner>
