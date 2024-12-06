<script lang="ts">
	import { fly } from 'svelte/transition';
	import { m } from '$lib/i18n';
	import CopyButton from '$lib/components/copyButton.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { navigating } from '$app/stores';

	export let isModalOpen: boolean;
	export let textToCopy: string | undefined = undefined;
	export let closeCb: () => void;
	const closeModal = () => {
		closeCb();
		isModalOpen = false;
	};

	const closeModalOnEvent = (ev: any) => {
		ev.detail.register(20, (processNextHandler) => {
			isModalOpen = false;
			processNextHandler();
		});
	};

	onMount(() => {
		document.addEventListener('ionBackButton', closeModalOnEvent);
	});

	onDestroy(() => {
		document.removeEventListener('ionBackButton', closeModalOnEvent);
	});

	$: if ($navigating) isModalOpen = false;
</script>

<ion-modal is-open={isModalOpen} backdrop-dismiss={false} transition:fly class="visible">
	<hr />
	<ion-header>
		<ion-toolbar>
			<ion-title>{m.Results()}</ion-title>
			<ion-buttons slot="end">
				<ion-button color="danger" on:click={closeModal} on:keydown={closeModal} aria-hidden
					>{m.Close()}</ion-button
				>
				{#if textToCopy}
					<CopyButton {textToCopy} delay={1000} />
				{/if}
			</ion-buttons>
		</ion-toolbar>	
	</ion-header>
	<ion-content class="ion-padding visible">
		
		<d-vertical-stack class="mt-4">
			<slot />
		</d-vertical-stack>
	</ion-content>
</ion-modal>
