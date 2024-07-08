<script lang="ts">
	import { page, navigating } from '$app/stores';
	import { goto, r } from '$lib/i18n';
	import { goto as svelteGoto } from '$app/navigation';
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
				await svelteGoto(r('/' + tab.tab));
			}
		});
	}

	const tabBarClick = async (selectedTab: string) => {
		await goto('/' + selectedTab);
	};
</script>

<ion-tabs>
	<slot />
	<ion-tab-bar slot="bottom" class="ion-padding flex justify-between py-0">
		{#each tabs as tab}
			<d-tab-button
				tab={tab.tab}
				on:keydown={() => {
					tabBarClick(tab.tab);
				}}
				on:click={() => {
					tabBarClick(tab.tab);
				}}
				aria-hidden
				active={currentTabName === tab.tab}
				hasAlert={tab.hasAlert}
			>
				{tab.label}
			</d-tab-button>
		{/each}
	</ion-tab-bar>
</ion-tabs>
