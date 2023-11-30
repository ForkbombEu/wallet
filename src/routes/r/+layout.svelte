<script lang="ts">
	import { contractOutline, walletOutline, personOutline, phonePortrait, codeWorkingOutline } from 'ionicons/icons';
	//@ts-ignore
	import IonTabs from 'ionic-svelte/components/IonTabs.svelte';
</script>

<IonTabs
	slot="bottom"
	tabs={[
		{ label: 'Services', icon: contractOutline, tab: 'services' },
		{ label: 'Wallet', icon: walletOutline, tab: 'wallet' },
		{ label: 'Native Functions', icon: phonePortrait, tab: 'native' },
		{ label: 'Slangroom', icon: personOutline, tab: 'slangroom' },
		{ label: 'Json Schema', icon: codeWorkingOutline, tab: 'json'}
	]}
>
	<slot />
</IonTabs>
