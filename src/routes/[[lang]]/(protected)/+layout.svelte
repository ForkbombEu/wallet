<script lang="ts">
	import { home, walletOutline, personOutline, notificationsOutline } from 'ionicons/icons';

	// Note – IonTabs must be imported this way, otherwise the app breaks
	//@ts-ignore
	import IonTabs from 'ionic-svelte/components/IonTabs.svelte';
	import { type IonTabProps, Tabs } from '$lib/tabs';
	import { m } from '$lib/i18n';

	//

	const tabs: IonTabProps[] = [
		{ label: m.Home(), icon: home, tab: Tabs.home },
		{ label: m.Wallet(), icon: walletOutline, tab: Tabs.wallet },
		{ label: m.Notifications(), icon: notificationsOutline, tab: Tabs.notifications },
		{ label: m.Profile(), icon: personOutline, tab: Tabs.profile }
	];
</script>

<IonTabs slot="bottom" {tabs}>
	<slot />
</IonTabs>
