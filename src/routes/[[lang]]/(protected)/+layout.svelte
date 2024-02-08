<script lang="ts">
	import { home, walletOutline, personOutline, notificationsOutline } from 'ionicons/icons';

	// Note – IonTabs must be imported this way, otherwise the app breaks
	//@ts-ignore
	import IonTabs from 'ionic-svelte/components/IonTabs.svelte';
	import { type IonTabProps, Tabs } from '$lib/tabs';

	//

	const tabs: IonTabProps[] = [
		{ label: 'Home', icon: home, tab: Tabs.home },
		{ label: 'Wallet', icon: walletOutline, tab: Tabs.wallet },
		{ label: 'Notifications', icon: notificationsOutline, tab: Tabs.notifications },
		{ label: 'Profile', icon: personOutline, tab: Tabs.profile }
	];
</script>

<IonTabs slot="bottom" {tabs}>
	<slot />
</IonTabs>
