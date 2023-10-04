<script lang="ts">
	import IonTabs from 'ionic-svelte/components/IonTabs.svelte';
    // import { IonTabs } from 'ionic-svelte';

	import { videocam, idCard} from 'ionicons/icons';

	const myTabs = [
		{
			label: 'credentials',
			icon: idCard,
			tab: 'credentials',
		},
		{ label: 'scanner', icon: videocam, tab: 'scanner'},
	];

	const logStuff = () => { console.log("changed"); };
</script>

<IonTabs slot="bottom" tabs={myTabs} ionTabsWillChange={logStuff} ionTabsDidChange={logStuff}>
	<slot />
</IonTabs>