<script lang="ts">
	import { fly } from 'svelte/transition';
	import { m } from '$lib/i18n';

	export let isModalOpen: boolean;
	export let closeCb: () => void;
	const closeModal = () => {
		isModalOpen = false;
		closeCb();
	};
</script>

<ion-modal
	is-open={isModalOpen}
	backdrop-dismiss={false}
	transition:fly
	class="visible"
>
	<hr />
	<ion-content class="ion-padding visible">
		<ion-toolbar>
			<ion-title>{m.Results()}</ion-title>
			<ion-buttons slot="end">
				<ion-button color="danger" on:click={closeModal} on:keydown={closeModal} aria-hidden
					>{m.Close()}</ion-button
				>
			</ion-buttons>
		</ion-toolbar>
		<div class="mt-4 flex flex-col gap-2">
			<slot />
		</div>
	</ion-content>
</ion-modal>
