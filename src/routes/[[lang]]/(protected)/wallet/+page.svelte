<script lang="ts">
	import { goto, m, r } from '$lib/i18n';
	import { languageTag } from '$paraglide/runtime';
	import { claimLabel, formatCredentialDate } from '$lib/credentialPresentation';
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
			button-text={m.Go_to_issuance_services()}
			button-color="accent"
			href={r('/home')}
		>
			<d-illustration illustration="empty-wallet" aria-hidden="true" />
		</d-empty-state>
	{:else}
		<div class="grid grid-cols-1 gap-12 md:grid-cols-2">
			{#each credentials as credential}
				{@const expirationDate = formatCredentialDate(credential.expirationDate, languageTag())}
				<button
					type="button"
					on:click={() => goto(`/${credential.id}/credential-detail`)}
					class="relative min-w-0 text-left"
				>
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
						expiration-date={expirationDate}
						name={credential.display_name}
						logo-src={credential.logo?.uri}
						issued-by-label={m.Issued_by()}
						expiration-label={m.Expires()}
					>
						{#if credential.type === 'ldp_vc'}
							{#each Array.from(Object.entries(credential.ldpVc.credentialSubject)) as disclosure}
								<d-badge>{claimLabel(disclosure[0])}</d-badge>
							{/each}
						{:else if credential.type === 'sdjwt'}
							{#await decodeSdJwt(credential.sdJwt) then sdjwt}
								{#each sdjwt.credential.disclosures as disclosure}
									<d-badge>{claimLabel(disclosure[1])}</d-badge>
								{/each}
							{/await}
						{/if}
					</d-credential-card>
				</button>
			{/each}
		</div>
	{/if}
</d-tab-page>
