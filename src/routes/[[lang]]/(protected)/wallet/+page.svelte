<script lang="ts">
	import { goto, m, r } from '$lib/i18n';
	import dayjs from 'dayjs';
	import { scanButton } from '$lib/tabs';
	import { decodeSdJwt } from '$lib/openId4vci';

	export let data;
	const { credentials } = data;
</script>

<d-tab-page tab="wallet" title={m.Wallet()} {...scanButton}>
	<d-page-description
		title={m.My_issued_credentials()}
		description={m.Explore_and_manage_your_verified_credentials()}
	/>
	{#if credentials.length == 0}
		<d-empty-state
			heading={m.Nothing_in_your_wallet()}
			text={m.Start_getting_your_first_credential()}
			buttonText={m.Go_to_issuance_services()}
			href={r('/home')}
		>
			<d-illustration illustration="empty-wallet" />
		</d-empty-state>
	{:else}
		<div class="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-12">
			{#each credentials as credential}
				{@const expirationDate = dayjs.unix(credential.expirationDate).format('DD.MM.YYYY HH:mm')}
				<button on:click={() => goto(`/${credential.id}/credential-detail`)} class="relative">
					{#if credential.expirationDate < dayjs().unix()}
						<div
							class="absolute flex h-full w-full items-center justify-center rounded-lg bg-primary opacity-80"
						>
							<d-text size="l" class="font-bold uppercase text-error">
								{m.expired_on()}
								{expirationDate}
							</d-text>
						</div>
					{/if}
					<d-credential-card
						{...credential}
						{expirationDate}
						name={credential.display_name}
						logoSrc={credential.logo.uri}
						issuedByLabel={m.Issued_by()}
						expirationLabel={'Exp'}
						class="max-w-44"
						>{#await decodeSdJwt(credential.sdJwt) then sdjwt}
							{#each sdjwt.credential.disclosures as disclosure}
								<d-badge>{disclosure[1]}</d-badge>
							{/each}
						{/await}
					</d-credential-card>
				</button>
			{/each}
		</div>
	{/if}
</d-tab-page>
