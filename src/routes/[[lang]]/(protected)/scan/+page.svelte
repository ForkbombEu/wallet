<script lang="ts">
	import Modal from '$lib/components/molecules/Modal.svelte';
	import Scanner from '$lib/components/organisms/scanner/Scanner.svelte';
	import { gotoQrResult } from '$lib/components/organisms/scanner/tools';
	import { Capacitor } from '@capacitor/core';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';

	let barcodeResult: { message?: string } = { message: undefined };
	const isWeb = Capacitor.getPlatform() == 'web';

	function showModal() {
		pushState('', {
			isModalOpen: true
		});
	}
</script>

<Scanner
	let:scan
	on:success={async (e) => {
		const qr = e.detail.qr;
		if (!(qr.startsWith('openid4vp://') | qr.startsWith('openid-credential-offer://'))) {
			showModal();
			return;
		}
		try {
			await gotoQrResult(qr);
		} catch (e) {
			showModal();
			//@ts-ignore
			barcodeResult.message = e.message;
		}
	}}
>
	<Modal
		isModalOpen={$page.state.isModalOpen}
		closeCb={() => {
			window.history.back();
			if (!isWeb) scan();
		}}
		textToCopy={barcodeResult.message}
	>
		<d-text size="m">{barcodeResult?.message || 'error'}</d-text>
	</Modal>
</Scanner>
