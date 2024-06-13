<script>
	import { chevronBackOutline } from 'ionicons/icons';
	import { m } from '$lib/i18n';
	import SettingsIcon from '$lib/assets/Settings.svelte';
	import Settings from './Settings.svelte';
	export let backButton = true;
	export let settings = false;
</script>

<ion-header class="shadow-none" translucent>
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
		{#if settings}
			<ion-buttons slot="end">
				<ion-menu-toggle>
					<ion-button>
						<span slot="icon-only">
							<SettingsIcon />
						</span>
					</ion-button>
				</ion-menu-toggle>
			</ion-buttons>
		{/if}
	</ion-toolbar>
</ion-header>
<ion-menu content-id="main-content">
	<ion-header>
		<ion-toolbar>
			<ion-title>{m.Settings()}</ion-title>
		</ion-toolbar>
	</ion-header>
	<ion-content class="ion-padding"><Settings /></ion-content>
</ion-menu>

<style>
	ion-menu {
		--width: 340px;
	}
</style>
