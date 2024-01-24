<script lang="ts">
	import Card from '$lib/components/molecules/Card.svelte';
	import ScanButton from '$lib/components/molecules/ScanButton.svelte';
	import TabPage from '$lib/tabs/TabPage.svelte';
	import fakeCredentials from '$lib/fakeCredentials';
</script>

<TabPage tab="home" title="HOME">
	{#each fakeCredentials as credential}
		<Card title={credential.title} content={credential.issuedBy}>
			<ion-button href="/request">Available</ion-button>
		</Card>
	{/each}
	<ScanButton />
</TabPage>
