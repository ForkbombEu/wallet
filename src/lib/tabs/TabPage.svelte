<script lang="ts">
	import Header from '$lib/components/molecules/Header.svelte';
	import { m, r } from '$lib/i18n';
	import type { Tab } from '.';

	export let tab: Tab;
	export let title: string;
	export let settings = false;
</script>

<ion-tab {tab}>
	<Header backButton={false} {settings}>{title}</Header>

	<ion-content fullscreen class="ion-padding" id="main-content">
		<slot />
		<d-scan-button href={r('/scan')}>
			{m.SCAN_QR()}
		</d-scan-button>
		<div class="pb-24" />
	</ion-content>
</ion-tab>
