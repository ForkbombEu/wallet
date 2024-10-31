<script lang="ts">
	import { page, navigating } from '$app/stores';
	import { goto } from '$lib/i18n';
	import type { TabProps } from '.';

	/**
    An array of tab objects containing label, and tab properties.
    @type {{label: string; tab: string;, hasAlert: boolean;}[]}
    */
	export let tabs: TabProps[] = [];

	const { pathname } = $page.url;
	const pathSplit = pathname.split('/');
	let currentTabName = pathSplit[pathSplit.length - 1];

	$: if ($navigating && $navigating.to) {
		tabs.forEach(async (tab) => {
			if ($navigating.to?.url.pathname.includes(tab.tab)) {
				currentTabName = tab.tab;
			}
		});
	}

	const tabBarClick = async (selectedTab: string) => {
		await goto('/' + selectedTab);
	};
</script>

<ion-tabs>
	<slot />
	{#key currentTabName}
		<ion-tab-bar slot="bottom" class="ion-padding flex min-h-12 justify-between py-0">
			{#each tabs as tabObj}
				{@const { tab, hasAlert, label } = tabObj}
				<d-tab-button
					{tab}
					on:keydown={() => {
						tabBarClick(tab);
					}}
					on:click={() => {
						tabBarClick(tab);
					}}
					aria-hidden
					active={currentTabName === tab}
					{hasAlert}
				>
					{label}
				</d-tab-button>
			{/each}
		</ion-tab-bar>
	{/key}
</ion-tabs>
