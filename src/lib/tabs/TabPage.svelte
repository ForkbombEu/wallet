<script lang="ts">
	import LanguageSwitcher from '$lib/components/languageSwitcher.svelte';
	import type { Tab } from '.';

	export let tab: Tab;
	export let title: string;
</script>

<ion-tab {tab}>
	<ion-header>
		<ion-toolbar>
			<ion-buttons slot="end" class="pr-4">
				<LanguageSwitcher />
			</ion-buttons>
			<ion-title>{title}</ion-title>
		</ion-toolbar>
	</ion-header>

	<ion-content fullscreen>
		<div class="p-4">
			<slot />
		</div>
	</ion-content>
</ion-tab>
