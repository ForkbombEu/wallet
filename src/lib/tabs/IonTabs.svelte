<script>
  //Credits: https://github.com/Tommertom/ionic-svelte-tabs-howto
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { page, navigating } from '$app/stores';

	import { goto } from '$app/navigation';

	export let ionTabsDidChange = () => {};
	export let ionTabsWillChange = () => {};

	/**
    An array of tab objects containing label, and tab properties.
    @type {{label: string; tab: string;}[]}
    */
	export let tabs = [];

	let ionTabBarElement;
	let controller;

	// we need relative path for the goto to function properly and to allow for relative tab definitions
	const { pathname } = $page.url;
	const pathSplit = pathname.split('/');
	let currentTabName = pathSplit[pathSplit.length - 1]; // we don't want to use at(-1) because of old browsers
	const relativePath = pathname.replace(currentTabName, '');

	// we need to capture the router changes - to support a-href navigation and other stuff
	$: if ($navigating && $navigating.to) {
		tabs.forEach(async (tab) => {
			if ($navigating.to.url.pathname.includes(relativePath + tab.tab)) {
				currentTabName = tab.tab;
				await goto(relativePath + tab.tab);
				controller.select(tab.tab);
			}
		});
	}

	onMount(async () => {
		// reassignment needed after onMount
		controller = ionTabBarElement;
		controller.select(currentTabName);
	});

	const tabBarClick = async (selectedTab) => {
		currentTabName = selectedTab;
		await goto(relativePath + selectedTab);
		controller.select(selectedTab);
	};
</script>

<ion-tabs
	on:ionTabsDidChange={ionTabsDidChange}
	on:ionTabsWillChange={ionTabsWillChange}
	bind:this={ionTabBarElement}
>
	<slot />

	<ion-tab-bar slot="bottom" class="flex ion-padding py-0 justify-between">
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
			>
				{tab.label}
			</d-tab-button>
		{/each}
	</ion-tab-bar>
</ion-tabs>
