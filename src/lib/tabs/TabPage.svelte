<script lang="ts">
	import Header from '$lib/components/molecules/Header.svelte';
	import ScanButton from '$lib/components/molecules/ScanButton.svelte';
	import type { Tab } from '.';

	export let tab: Tab;
	export let title: string;
	export let settings = false;
</script>

<ion-tab {tab}>
	<Header backButton={false} {settings}>{title}</Header>

	<ion-content fullscreen class="ion-padding" id="main-content">
		<slot />
		<ScanButton />
		<div class="pb-24" />
	</ion-content>
</ion-tab>
