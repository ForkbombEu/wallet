<script lang="ts">
	import { type IonTabProps, Tabs } from '$lib/tabs';
	import IonTabs from '$lib/tabs/IonTabs.svelte';
	import { m } from '$lib/i18n';
	import { page } from '$app/stores';
	const isActive = (tab: string) => $page.url.pathname.split('/').reverse()[0] === tab;

	//

	const tabs: IonTabProps[] = [
		{ label: m.Home(), tab: Tabs.home },
		{ label: m.Wallet(), tab: Tabs.wallet },
		{ label: m.Notifications(), tab: Tabs.activity },
		{ label: m.Profile(), tab: Tabs.profile }
	];
</script>

<!-- <ion-tabs>
	<slot />
	<ion-tab-bar slot="bottom" class="ion-padding flex justify-between">
		{#each tabs as { label, tab }}
			<ion-tab-button {tab} active={isActive(tab)}>
				{label}
			</ion-tab-button>
		{/each}
	</ion-tab-bar>
</ion-tabs> -->
<IonTabs {tabs}><slot /></IonTabs>
