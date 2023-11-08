<script lang="ts">
	import { contractOutline, walletOutline, personOutline, phonePortrait, personRemove } from 'ionicons/icons';
	//@ts-ignore
	import IonTabs from 'ionic-svelte/components/IonTabs.svelte';
</script>

<IonTabs
	slot="bottom"
	tabs={[
		{ label: 'Services', icon: contractOutline, tab: 'services' },
		{ label: 'Wallet', icon: walletOutline, tab: 'wallet' },
		{ label: 'Native Functions', icon: phonePortrait, tab: 'native' },
		{ label: 'My Profile', icon: personOutline, tab: 'profile' },
		{ label: 'Slangroom', icon: personOutline, tab: 'slangroom' },
		{ label: 'Logout', icon: personRemove, tab: 'logout' }
	]}
>
	<slot />
</IonTabs>
