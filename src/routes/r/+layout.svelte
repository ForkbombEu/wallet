<script lang="ts">
	import { home, walletOutline, personOutline, notificationsOutline } from 'ionicons/icons';
	//@ts-ignore
	import IonTabs from 'ionic-svelte/components/IonTabs.svelte';
</script>

<IonTabs
	slot="bottom"
	tabs={[
		{ label: 'Home', icon: home, tab: 'home' },
		{ label: 'Wallet', icon: walletOutline, tab: 'wallet' },
		{ label: 'Notifications', icon: notificationsOutline, tab: 'notifications' },
		{ label: 'Profile', icon: personOutline, tab: 'profile' }
	]}
>
	<slot />
</IonTabs>
