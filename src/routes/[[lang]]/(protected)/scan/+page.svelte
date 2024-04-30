<script lang="ts">
	import { goto } from '$app/navigation';
	import Modal from '$lib/components/molecules/Modal.svelte';
	import Scanner from '$lib/components/organisms/scanner/Scanner.svelte';
	import {
		parseQr,
		verifyCredential,
		type ParseQrResults,
		type Post
	} from '$lib/components/organisms/scanner/tools';
	import { m } from '$lib/i18n';
	import { log } from '$lib/log';

	let barcodeResult: ParseQrResults;
	let isModalOpen: boolean;
	let res: any;

	const request = async (post: Post) => {
		res = await verifyCredential(post);
		log(JSON.stringify(res));
	};

	const decline = async () => {
		isModalOpen = false; 
		await goto('/');
	};
</script>

<Scanner
	let:scan
	on:success={async (e) => {
		barcodeResult = await parseQr(e.detail.qr);
		if (barcodeResult.result === 'ok' && barcodeResult.data.type === 'service') {
			return await goto(
				`/credential-offer?service=${encodeURI(JSON.stringify(barcodeResult.data.service))}`
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
			{@const { info, post } = credential}
			{@const { rp_name, verifier_name, asked_claims } = info}
			{@const { properties } = asked_claims}
			{@const propertiesArray = Object.values(properties)}
			<d-heading size="s">{rp_name}</d-heading>
			<!-- <ion-label>{verifier_name}</ion-label> -->
			<d-text>It will ask you for:</d-text>
			{#each propertiesArray as property}
				<d-text>{property.title}</d-text>
			{/each}
			<br />
			<d-text>Are you sure?</d-text>
			<d-button
				on:click={() => request(post)}
				on:keydown={() => request(post)}
				aria-hidden
				expand
				color="accent">{m.Verify()}</d-button
			>
			<d-button on:click={decline} on:keydown={decline} expand aria-hidden
				>{m.Decline()}</d-button
			>
		{/if}
	</Modal>
</Scanner>
