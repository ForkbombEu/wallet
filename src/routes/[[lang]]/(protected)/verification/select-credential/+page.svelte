<script lang="ts">
	import HeaderWithBackButton from '$lib/components/molecules/HeaderWithBackButton.svelte';
	import { m, goto } from '$lib/i18n';
	import type { Feedback } from '$lib/utils/types.js';
	import { verificationStore } from '$lib/verificationStore.js';
	import dayjs from 'dayjs';
	import { log } from '$lib/log.js';
	import { addVerificationActivity } from '$lib/preferences/activity.js';
	import { verifyCredential } from '$lib/components/organisms/scanner/tools.js';
	import { negativeFeedback } from '$lib/utils/index.js';
	import {
		verificationResultsStore,
		type VerificationResponse
	} from '$lib/verificationResultsStore.js';
	import DebugPopup from '$lib/components/organisms/debug/DebugPopup.svelte';
	import { debugDismiss } from '$lib/components/organisms/debug/debug';
	import FingerPrint from '$lib/assets/lottieFingerPrint/FingerPrint.svelte';
	import { claimLabel, claimValue, recipientDomain } from '$lib/credentialPresentation';
	import {
		isSelectionComplete,
		toggleCredential,
		preparePresentation,
		type SelectedCredentials
	} from '$lib/credentialSelection';

	type Verification = {
		result: {
			result: { result: VerificationResponse & { redirect_uri?: string }; status: string };
		};
		logs: string;
	};

	export let data;
	const { credentials, verifier } = data;
	let selectedCredential: SelectedCredentials = [];
	let loading = false;
	const { post_url, state } = $verificationStore;

	$: allCredentialsSelected = isSelectionComplete(credentials, selectedCredential);

	const selectCredential = (group: number, option: number, credential: number, variant: number) => {
		selectedCredential = toggleCredential(selectedCredential, group, option, credential, variant);
	};
	const clearGroup = (group: number) => {
		selectedCredential = selectedCredential.slice();
		selectedCredential[group] = undefined;
	};
	const decline = async () => {
		selectedCredential = [];
		await goto('/wallet');
	};

	const verify = async () => {
		if (loading || !isSelectionComplete(credentials, selectedCredential)) return;
		loading = true;
		try {
			const { prop, vp_token } = preparePresentation(credentials, selectedCredential);
			const verification = (await verifyCredential({
				url: post_url,
				body: { state, vp_token }
			})) as Verification;
			const responseSuccess = verification.result?.result?.status === '200';
			const responseRedirectUri = verification.result?.result?.result?.redirect_uri;
			await debugDismiss();
			const feedback: Feedback = responseSuccess ? {} : negativeFeedback(m.Sharing_failed_help());
			const sid = verification.result?.result?.result?.complete_transaction_id;
			verificationResultsStore.set({
				feedback,
				date: dayjs().toString(),
				id: sid || '',
				success: responseSuccess
			});
			log(JSON.stringify(verification));
			for (const properties of Object.values(prop)) {
				await addVerificationActivity(sid, responseSuccess, post_url, properties);
			}
			if (responseRedirectUri) window.location.href = responseRedirectUri;
			await goto('/verification/results');
		} catch (error) {
			verificationResultsStore.set({
				feedback: negativeFeedback(m.Sharing_failed_help()),
				date: dayjs().toString(),
				id: '',
				success: false
			});
			log(String(error));
			await goto('/verification/results');
		} finally {
			loading = false;
		}
	};
</script>

<div class="ion-page">
	<HeaderWithBackButton>{m.Verification()}</HeaderWithBackButton>
	<d-loading {loading}><FingerPrint /></d-loading>
	<ion-content class="ion-padding">
		<div class="flex flex-col gap-6 pb-4">
			<div class="flex flex-col gap-2">
				<d-heading size="s" level={1}>{m.Review_sharing()}</d-heading>
				<d-text>{m.Sharing_explanation()}</d-text>
				<d-text size="s" class="text-on-alt">{m.Recipient()}</d-text>
				<d-text class="break-all font-semibold">{recipientDomain(verifier)}</d-text>
				<details>
					<summary class="py-2">{m.Verifier_url()}</summary>
					<p class="break-all">{verifier}</p>
				</details>
			</div>
			{#each credentials as group, groupIndex}
				<section class="flex min-w-0 flex-col gap-3">
					<d-badge class="self-start">{group.required ? m.required() : m.optional()}</d-badge>
					{#if !group.claims.length}
						<d-heading size="xs">{m.No_matching_credentials()}</d-heading>
						<d-text>{m.No_matching_credentials_help()}</d-text>
					{/if}
					{#each group.claims as option, optionIndex}
						{#each option as [key, variants], credentialIndex}
							<d-text class="font-semibold">{claimLabel(key)} {m.with_claims()}:</d-text>
							{#each variants as credential, variantIndex}
								<d-verification-card
									selected={selectedCredential[groupIndex]?.[optionIndex]?.[credentialIndex] ===
										variantIndex}
									relying-party={credential.issuer}
									flow={claimLabel(credential.type[1] || key)}
									logo={credential.logo}
									disabled={loading}
									on:click={() =>
										selectCredential(groupIndex, optionIndex, credentialIndex, variantIndex)}
								>
									{#each Object.entries(credential.claims) as [name, value]}
										<d-text size="s" class="break-words"
											><b>{claimLabel(name)}:</b> {claimValue(value)}</d-text
										>
									{/each}
								</d-verification-card>
								{#if variantIndex < variants.length - 1}<d-text>{m.or()}</d-text>{/if}
							{/each}
						{/each}
						{#if optionIndex < group.claims.length - 1}<d-text>{m.or_credentials()}</d-text>{/if}
					{/each}
					{#if selectedCredential[groupIndex]}
						<d-button
							clear
							color="accent"
							on:click={() => clearGroup(groupIndex)}
							disabled={loading}
						>
							{m.Clear_group_selection()}
						</d-button>
					{/if}
				</section>
			{:else}
				<d-empty-state
					heading={m.No_matching_credentials()}
					text={m.No_matching_credentials_help()}
				/>
			{/each}
		</div>
		<DebugPopup />
	</ion-content>
	<ion-footer class="ion-no-border" role="region" aria-label={m.Share_selected_information()}>
		<div class="sharing-actions bg-surface">
			{#if !allCredentialsSelected}<p class="text-on-alt">{m.Select_required_credentials()}</p>{/if}
			<d-button
				expand
				color="accent"
				disabled={!allCredentialsSelected || loading}
				on:click={verify}
			>
				{m.Share_selected_information()}
			</d-button>
			<d-button expand disabled={loading} on:click={decline}>{m.Decline()}</d-button>
		</div>
	</ion-footer>
</div>

<style>
	.sharing-actions {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.75rem 1rem max(0.75rem, env(safe-area-inset-bottom));
	}
</style>
