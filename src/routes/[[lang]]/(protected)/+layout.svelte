<script lang="ts">
	import { type TabProps, Tabs } from '$lib/tabs';
	import IonTabs from '$lib/tabs/IonTabs.svelte';
	import { App } from '@capacitor/app';
	import { goto, m, r } from '$lib/i18n';
	import { onDestroy, onMount } from 'svelte';
	import type { PluginListenerHandle } from '@capacitor/core';
	import { clearHttpStorage } from '$lib/utils/index.js';

	export let data;
	let appStateChange: PluginListenerHandle;

	//

	onMount(async () => {
		appStateChange = await App.addListener('appStateChange', async (state) => {
			await clearHttpStorage();
			if (!state.isActive && !(r('/user-settings') === window.location.pathname)) {
				await goto('/unlock');
			}
		});
	});

	onDestroy(() => {
		if (appStateChange) appStateChange?.remove();
	});

	let tabs: TabProps[] = [
		{ label: m.Home(), tab: Tabs.home, hasAlert: data.hasHomeFeedback },
		{ label: m.Wallet(), tab: Tabs.wallet },
		{ label: m.Notifications(), tab: Tabs.activity, hasAlert: Boolean(data.notReadedActivities) },
		{ label: m.Profile(), tab: Tabs.profile }
	];
	$: tabs = [
		{ label: m.Home(), tab: Tabs.home, hasAlert: data.hasHomeFeedback },
		{ label: m.Wallet(), tab: Tabs.wallet },
		{ label: m.Notifications(), tab: Tabs.activity, hasAlert: Boolean(data.notReadedActivities) },
		{ label: m.Profile(), tab: Tabs.profile }
	];
</script>

<IonTabs {tabs}><slot /></IonTabs>
