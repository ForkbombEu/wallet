<script lang="ts">
	import TabPage from '$lib/components/organisms/TabPage.svelte';
	import ScanButton from '$lib/components/molecules/ScanButton.svelte';
	import Card from '$lib/components/molecules/Card.svelte';
	import fakeCredentials from '$lib/fakeCredentials';
</script>

<TabPage tabId="wallet" title="Your Credentials">
	{#each fakeCredentials as credential}
		<Card title={credential.title} content={credential.issuedBy}>
			<ion-button href={`/r/scan`}>Verify</ion-button>
		</Card>
	{/each}
	<ScanButton />
</TabPage>
