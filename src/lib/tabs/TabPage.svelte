<script lang="ts">
	import LanguageSwitcher from '$lib/components/languageSwitcher.svelte';
	import Header from '$lib/components/molecules/Header.svelte';
	import type { Tab } from '.';

	export let tab: Tab;
	export let title: string;
</script>

<ion-tab {tab}>
	<Header>{title}</Header>

	<ion-content fullscreen>
		<div class="p-4">
			<slot />
		</div>
	</ion-content>
</ion-tab>
