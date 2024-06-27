<script lang="ts">
	import Loading from '$lib/components/molecules/Loading.svelte';
	import { m, r } from '$lib/i18n';
	import { getCredentialsPreference } from '$lib/preferences/credentials';
	import TabPage from '$lib/tabs/TabPage.svelte';
	import dayjs from 'dayjs';
	import { arrowForwardOutline } from 'ionicons/icons';
	import type { Credential } from '$lib/preferences/credentials';
	import EmptyWallet from '$lib/assets/EmptyWallet.svelte';

	const sortCredentials = (credentials: Credential[]) => {
		return credentials.slice().sort((a: any, b: any) => {
			const currentTime = dayjs().unix();
			const isAExpired = a.expirationDate < currentTime;
			const isBExpired = b.expirationDate < currentTime;

			if (isAExpired && !isBExpired) return 1;
			if (!isAExpired && isBExpired) return -1;
			return a.expirationDate - b.expirationDate;
		});
	};
</script>

<TabPage tab="wallet" title="WALLET">
	<d-page-description
		title={m.My_issued_credentials()}
		description={m.Explore_and_manage_your_verified_credentials()}
	/>
	{#await getCredentialsPreference()}
		<Loading />
	{:then credentials}
		{#if !credentials}
			<div class="flex h-3/5 flex-col items-center justify-center gap-1">
				<div>
					<EmptyWallet/>
				</div>
				<d-heading size="s">{m.Nothing_in_your_wallet()}</d-heading>
				<d-text size="l" class="pb-4">{m.Start_getting_your_first_credential()}</d-text>
				<d-button expand color="outline" href={r('/home')} class="w-full">
					{m.Go_to_issuance_services()} <ion-icon slot="end" icon={arrowForwardOutline} />
				</d-button>
			</div>
		{:else}
			{@const sortedCredentials = sortCredentials(credentials)}
			<div class="flex flex-col gap-2">
				{#each sortedCredentials as credential}
					{@const expirationDate = dayjs.unix(credential.expirationDate).format('DD.MM.YYYY HH:mm')}
					<a href={r(`/${credential.id}/credential-detail`)} class="relative">
						{#if credential.expirationDate < dayjs().unix()}
							<div
								class="absolute flex h-full w-full items-center justify-center rounded-lg bg-primary opacity-80"
							>
								<d-text size="l" class="font-bold uppercase text-error">
									{m.expired_on()} {expirationDate}
								</d-text>
							</div>
						{/if}

						<d-credential-card
							{...credential}
							{expirationDate}
							name={credential.display_name}
							logoSrc={credential.logo.url}
						/>
					</a>
				{/each}
			</div>
		{/if}
	{:catch error}
		<div class="flex h-3/5 flex-col items-center justify-center gap-1">
			<d-heading size="s">{m.Error()}</d-heading>
			<d-text size="l" class="pb-4">{error.message}</d-text>
		</div>
	{/await}
</TabPage>
