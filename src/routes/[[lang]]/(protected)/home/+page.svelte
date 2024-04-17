<script lang="ts">
	import ScanButton from '$lib/components/molecules/ScanButton.svelte';
	import TabPage from '$lib/tabs/TabPage.svelte';
	import { getServices } from '$lib/slangroom/services';
	import { r, m } from '$lib/i18n';

	const getOfferUrl = (configurationId: string, issuerUrl: string) =>
		`/credential-offer-test?service=${encodeURI(
			JSON.stringify({
				credential_configuration_ids: [configurationId],
				credential_issuer: issuerUrl
			})
		)}`;
</script>

<TabPage tab="home" title="HOME">
	{#await getServices()}
		<ion-spinner />
	{:then res}
		{@const services = res.result.items}
		<d-heading>
			<h1>{m.Claim_credential()}</h1>
		</d-heading>
		<d-text size="l">
			<p class="pb-4">{m.Scan_QR_code_to_claim_credential_or_request_one_below()}</p></d-text
		>

		<div class="flex flex-col gap-2">
			{#each services as service}
				<d-credential-service
					name={service.display_name}
					issuer={service.expand.credential_issuer.name}
					href={r(getOfferUrl(service.type_name, service.expand.credential_issuer.endpoint))}
					logoSrc={service.logo}
				/>
			{/each}
		</div>
	{/await}
	<ScanButton />
</TabPage>
