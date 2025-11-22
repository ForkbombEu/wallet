<script lang="ts">
	import { goto, m } from '$lib/i18n';
	import HeaderWithBackButton from '$lib/components/molecules/HeaderWithBackButton.svelte';
	import DebugPopup from '$lib/components/organisms/debug/DebugPopup.svelte';

	export let data;
	const { propertiesArray, post_url } = data;

	const decline = async () => {
		await goto('/');
	};

	const gotoChooseCredential = async () => {
		await goto('/verification/select-credential');
	};
</script>

<HeaderWithBackButton>
	{m.Verification()}
</HeaderWithBackButton>

<ion-content fullscreen class="ion-padding">
	<div class="flex flex-col justify-between gap-3 pb-16">
		<div>
			<!-- <div class="flex items-center gap-2 pb-0.5">
				<d-heading size="s">{'verifier_name'}</d-heading>
				<div
					class="flex h-6 items-center justify-center rounded-md border border-solid border-success px-2"
				>
					<d-text class="text-xs text-success">{m.Verifier_App()}</d-text>
				</div>
			</div>
			<d-heading size="xs">{m.Is_asking_for_verification()}</d-heading><br /> -->
			<d-heading size="xs">{m.About_this_verifications()}</d-heading><br />
		</div>

		<div>
			<d-text size="l">{m.Verifier_url()}:</d-text>
			<div class="flex flex-col items-start gap-2.5 rounded-[5px] bg-primary px-5 py-5">
				<!-- <div class="flex items-center gap-2.5">
					<d-info-led type="warning" />
					<d-text><b>{m.Relying_party()}:</b> {'rp_name'}</d-text>
				</div> -->
				<div class="flex items-center gap-2.5">
					<d-text class="break-all">{post_url}</d-text>
				</div>
			</div>
		</div>
		<div>
			<d-text size="l">{m.Requested_credentials()}:</d-text>
			<div class="flex flex-col gap-6">
				{#each propertiesArray as cred_set}
					<div class="flex flex-col items-start gap-2.5 rounded-[5px] bg-primary px-5 py-5">
					<d-badge class="self-end">{cred_set.required? m.required(): m.optional()}</d-badge>
					{#each cred_set.options as creds, j (j)}
						{#each creds.credentials as credential}
							<d-text>{credential.id} {m.with_claims()}:</d-text>
							{#each credential.claims as claim_sets, i (i)}
								{#each claim_sets as claim}
									<div class="flex items-center gap-2.5 min-w-0">
										<d-info-led type="warning" />
										<d-text class="break-all whitespace-normal">
											{claim.path}{claim.value ? `: ${claim.value}`: ""}
										</d-text>
									</div>
								{/each}
								{#if i < credential.claims.length - 1}
									<d-text>{m.or_with_claims()}:</d-text>
								{/if}
							{/each}
						{/each}
						{#if j < cred_set.options.length - 1}
							<d-text>{m.or_credentials()}:</d-text>
						{/if}
					{/each}
					</div>
				{/each}
			</div>
		</div>

		<d-vertical-stack>
			<d-text size="s">{m.verification_page_description()}</d-text>
			<d-button on:click={gotoChooseCredential} aria-hidden expand color="accent"
				>{m.choose_credential()}</d-button
			>
			<d-button on:click={decline} expand aria-hidden>{m.Decline()}</d-button>
		</d-vertical-stack>
	</div>
	<DebugPopup />
</ion-content>
