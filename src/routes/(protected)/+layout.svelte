<script lang="ts">
	import { home, walletOutline, personOutline, notificationsOutline } from 'ionicons/icons';

	// Note – IonTabs must be imported this way, otherwise the app breaks
	//@ts-ignore
	import IonTabs from 'ionic-svelte/components/IonTabs.svelte';
</script>

<IonTabs
	slot="bottom"
	tabs={[
		{ label: 'Home', icon: home, tab: 'home' },
		{ label: 'Wallet', icon: walletOutline, tab: 'wallet' },
		{ label: 'Profile', icon: personOutline, tab: 'profile' }
		// { label: 'Notifications', icon: notificationsOutline, tab: 'notifications' },
	]}
>
	<slot />
</IonTabs>
