<script lang="ts">
	import Card from '$lib/components/molecules/Card.svelte';
	import ScanButton from '$lib/components/molecules/ScanButton.svelte';
	import TabPage from '$lib/components/organisms/TabPage.svelte';
	import fakeCredentials from '$lib/fakeCredentials';
</script>

<TabPage tabId="home" title="Available claims">
	{#each fakeCredentials as credential}
		<Card title={credential.title} content={credential.issuedBy}>
			<ion-button href={`/r/request/${0}`}>Available</ion-button>
		</Card>
	{/each}
	<ScanButton />
</TabPage>
