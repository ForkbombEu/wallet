<script lang="ts">
	import TabPage from '$lib/tabs/TabPage.svelte';
	import ScanButton from '$lib/components/molecules/ScanButton.svelte';
	import fakeCredentials from '$lib/fakeCredentials';
	import { m } from '$lib/i18n';
</script>

<TabPage tab="wallet" title="WALLET">
	<d-heading>
		<h1>{m.My_issued_credentials()}</h1>
	</d-heading>
	<d-text size="l"> <p class="pb-4">{m.Explore_and_manage_your_verified_credentials()}</p></d-text>
	<div class="flex flex-col gap-2">
		{#each fakeCredentials as credential}
			<d-credential-card
				name={credential.name}
				issuer={credential.issuer}
				description={credential.description}
				expiration-date={credential.expirationDate}
				verified={credential.verified}
			/>
		{/each}
	</div>
	<ScanButton />
</TabPage>
