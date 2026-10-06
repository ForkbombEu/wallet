<script lang="ts">
	import { goto, m } from '$lib/i18n';
	import HeaderWithBackButton from '$lib/components/molecules/HeaderWithBackButton.svelte';
	import DebugPopup from '$lib/components/organisms/debug/DebugPopup.svelte';
	import { claimLabel, claimValue, recipientDomain } from '$lib/credentialPresentation';

	export let data;
	const { propertiesArray, post_url } = data;
	const decline = () => goto('/wallet');
	const gotoChooseCredential = () => goto('/verification/select-credential');
</script>

<div class="ion-page">
	<HeaderWithBackButton>{m.Verification()}</HeaderWithBackButton>
	<ion-content fullscreen class="ion-padding">
		<div class="flex flex-col gap-6 pb-6">
			<div class="flex flex-col gap-2">
				<d-heading size="s" level={1}>{m.Review_sharing()}</d-heading>
				<d-text>{m.Sharing_explanation()}</d-text>
				<d-text size="s" class="text-on-alt">{m.Recipient()}</d-text>
				<d-text class="break-all font-semibold">{recipientDomain(post_url)}</d-text>
				<details>
					<summary class="py-2">{m.Verifier_url()}</summary>
					<p class="break-all">{post_url}</p>
				</details>
			</div>
			<d-heading size="xs">{m.Requested_credentials()}</d-heading>
			{#each propertiesArray as group}
				<section class="flex flex-col gap-3">
					<d-badge class="self-start">{group.required ? m.required() : m.optional()}</d-badge>
					{#each group.options as option, optionIndex}
						{#each option.credentials as credential}
							<d-text class="font-semibold">{claimLabel(credential.id)} {m.with_claims()}:</d-text>
							{#each credential.claims as claimSet, claimSetIndex}
								{#each claimSet as claim}
									<d-text class="break-words">
										{claimLabel(claim.path)}{claim.value !== undefined
											? ': ' + claimValue(claim.value)
											: ''}
									</d-text>
								{/each}
								{#if claimSetIndex < credential.claims.length - 1}<d-text
										>{m.or_with_claims()}:</d-text
									>{/if}
							{/each}
						{/each}
						{#if optionIndex < group.options.length - 1}<d-text>{m.or_credentials()}:</d-text>{/if}
					{/each}
				</section>
			{/each}
			<d-text size="s">{m.verification_page_description()}</d-text>
			<d-button on:click={gotoChooseCredential} expand color="accent"
				>{m.choose_credential()}</d-button
			>
			<d-button on:click={decline} expand>{m.Decline()}</d-button>
		</div>
		<DebugPopup />
	</ion-content>
</div>
