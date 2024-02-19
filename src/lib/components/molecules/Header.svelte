<script>
	import { chevronBackOutline, ellipsisHorizontal } from 'ionicons/icons';
	import Settings from './Settings.svelte';
	export let backButton = true;
	let isSettingsOpen = false;

	const openSettings = () => (isSettingsOpen = true);
	const closeSettings = () => (isSettingsOpen = false);
	//TODO: fix background color with actual token
</script>

<ion-header class="bg-primary">
	<ion-toolbar>
		{#if backButton}
			<ion-buttons slot="start">
				<ion-button
					on:click={() => window.history.back()}
					on:keydown={() => window.history.back()}
					aria-hidden
				>
					<ion-icon icon={chevronBackOutline} slot="icon-only"></ion-icon>
				</ion-button>
			</ion-buttons>
		{/if}
		<ion-title class="text-center">
			<slot />
		</ion-title>
		<ion-buttons slot="end">
			<ion-button on:click={openSettings} on:keydown={openSettings} aria-hidden>
				<ion-icon icon={ellipsisHorizontal} slot="icon-only"></ion-icon>
			</ion-button>
		</ion-buttons>
	</ion-toolbar>
</ion-header>
<ion-modal is-open={isSettingsOpen}>
	<ion-header>
		<ion-toolbar>
			<ion-title>
				<d-heading size="s"> Settings </d-heading>
			</ion-title>
			<ion-buttons slot="end">
				<ion-button on:click={closeSettings} on:keydown={closeSettings} aria-hidden
					>Close</ion-button
				>
			</ion-buttons>
		</ion-toolbar>
	</ion-header>
	<ion-content class="ion-padding">
		<Settings />
	</ion-content>
</ion-modal>
