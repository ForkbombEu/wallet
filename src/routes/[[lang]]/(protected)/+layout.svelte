<script lang="ts">
	import { type TabProps, Tabs } from '$lib/tabs';
	import IonTabs from '$lib/tabs/IonTabs.svelte';
	import { App } from '@capacitor/app';
	import { goto, m } from '$lib/i18n';
	import { onDestroy, onMount } from 'svelte';
	import type { PluginListenerHandle } from '@capacitor/core';

	export let data;
	const { notReadedActivities } = data;
	let appStateChange: PluginListenerHandle;

	//

	onMount(async () => {
		appStateChange = await App.addListener('appStateChange', async (state) => {
			console.log(state)
			if (!state.isActive) {
				await goto('/unlock');
			}
		});
	});

	onDestroy(() => {
		appStateChange.remove();
	});

	const tabs: TabProps[] = [
		{ label: m.Home(), tab: Tabs.home },
		{ label: m.Wallet(), tab: Tabs.wallet },
		{ label: m.Notifications(), tab: Tabs.activity, hasAlert: Boolean(notReadedActivities) },
		{ label: m.Profile(), tab: Tabs.profile }
	];
</script>

<IonTabs {tabs}><slot /></IonTabs>
