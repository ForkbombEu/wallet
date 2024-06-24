<script lang="ts">
	import { type IonTabProps, Tabs } from '$lib/tabs';
	import IonTabs from '$lib/tabs/IonTabs.svelte';
	import { App } from '@capacitor/app';
	import { goto, m } from '$lib/i18n';
	import { onDestroy, onMount } from 'svelte';
	import { lockApp } from '$lib/preferences/locked';
	import type { PluginListenerHandle } from '@capacitor/core';

	export let data;
	const { notReadedActivities } = data;
	let appStateChange: Promise<PluginListenerHandle> & PluginListenerHandle;

	//

	onMount(() => {
		appStateChange = App.addListener('appStateChange', async (state) => {
			if (!state.isActive) {
				await lockApp();
				await goto('/unlock');
			}
		});
	});

	onDestroy(() => {
		appStateChange.remove();
	});

	const tabs: IonTabProps[] = [
		{ label: m.Home(), tab: Tabs.home },
		{ label: m.Wallet(), tab: Tabs.wallet },
		{ label: m.Notifications(), tab: Tabs.activity, hasAlert: Boolean(notReadedActivities) },
		{ label: m.Profile(), tab: Tabs.profile }
	];
</script>

<IonTabs {tabs}><slot /></IonTabs>
