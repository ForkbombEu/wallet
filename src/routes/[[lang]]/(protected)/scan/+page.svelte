<script lang="ts">
	import Modal from '$lib/components/molecules/Modal.svelte';
	import Scanner from '$lib/components/organisms/scanner/Scanner.svelte';
	import { gotoQrResult } from '$lib/components/organisms/scanner/tools';
	import { Capacitor } from '@capacitor/core';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import { m } from '$lib/i18n';
	import FingerPrint from '$lib/assets/lottieFingerPrint/FingerPrint.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';

	let barcodeResult: { message?: string } = { message: undefined };
	const isWeb = Capacitor.getPlatform() == 'web';
	let loading = false;
	onMount(() => {
		EdgeToEdge.disable();
	});
	onDestroy(() => {
		EdgeToEdge.enable();
	});

	function showModal() {
		pushState('', {
			isModalOpen: true
		});
	}
</script>

<d-loading {loading}>
	<FingerPrint />
</d-loading>
<Scanner
	let:scan
	on:success={async (e) => {
		loading = true;
		const qr = e.detail.qr;
		if (!(qr.startsWith('openid4vp://') | qr.startsWith('openid-credential-offer://'))) {
			loading = false;
			barcodeResult = { message: m.qrcode_is_not_compatible() };
			showModal();
			return;
		}
		try {
			await gotoQrResult(qr);
			loading = false;
		} catch (e) {
			loading = false;
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
