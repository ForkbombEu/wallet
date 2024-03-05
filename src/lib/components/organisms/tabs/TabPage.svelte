<script lang="ts">
	import Header from '$lib/components/molecules/Header.svelte';
	import type { Tab } from '.';

	export let tab: Tab;
	export let title: string;
</script>

<ion-tab {tab}>
	<Header>{title}</Header>

	<ion-content fullscreen class="ion-padding">
		<slot />
	</ion-content>
</ion-tab>
