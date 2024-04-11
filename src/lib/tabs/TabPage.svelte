<script lang="ts">
	import Header from '$lib/components/molecules/Header.svelte';
	import type { Tab } from '.';

	export let tab: Tab;
	export let title: string;
	export let settings = false
</script>

<ion-tab {tab}>
	<Header backButton={false} {settings}>{title}</Header>

	<ion-content fullscreen class="ion-padding">
		<slot />
	</ion-content>
</ion-tab>
