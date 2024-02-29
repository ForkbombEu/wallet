<script lang="ts">
	import TabPage from '$lib/tabs/TabPage.svelte';
	import { m, r } from '$lib/i18n';
	import empty from '$lib/assets/empty.png';
	import { arrowForwardOutline } from 'ionicons/icons';
	import { getCredentialsPreference } from '$lib/preferences/credentials';
	
</script>

<TabPage tab="wallet" title="WALLET">
	<d-heading>
		<h1>{m.My_issued_credentials()}</h1>
	</d-heading>
	<d-text size="l"> <p class="pb-4">{m.Explore_and_manage_your_verified_credentials()}</p></d-text>
	{#await getCredentialsPreference()}
		<div class="flex h-3/5 flex-col items-center justify-center gap-1">
			<d-spinner />
		</div>
	{:then credentials}
		{#if !credentials}
			<div class="flex h-3/5 flex-col items-center justify-center gap-1">
				<img src={empty} alt="empty" class="w-1/2 max-w-64" />
				<d-heading size="s">{m.Nothing_in_your_wallet()}</d-heading>
				<d-text size="l" class="pb-4">{m.Start_getting_your_first_credential()}</d-text>
				<d-button expand color="accent" href={r('/home')}>
					{m.See_issuance_services()} <ion-icon slot="end" icon={arrowForwardOutline} />
				</d-button>
			</div>
		{:else}
			<div class="flex flex-col gap-2">
				{#each credentials as credential}
					<d-credential-card
						name={credential.name}
						issuer={credential.issuer}
						description={credential.description}
						expiration-date={credential.expirationDate}
						verified={credential.verified}
					/>
				{/each}
			</div>
		{/if}
	{:catch error}
		<div class="flex h-3/5 flex-col items-center justify-center gap-1">
			<d-heading size="s">Error</d-heading>
			<d-text size="l" class="pb-4">{error.message}</d-text>
		</div>
	{/await}
</TabPage>
