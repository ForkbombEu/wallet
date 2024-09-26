<script lang="ts">
	import HeaderWithBackButton from '$lib/components/molecules/HeaderWithBackButton.svelte';
	import { goto, m } from '$lib/i18n';
	import { getCredentialsbySdjwts } from '$lib/preferences/credentials';
	import { verificationStore } from '$lib/verificationStore';

	let selectedCredential: string | undefined = undefined;
	const selectCredential = (credential: string | undefined) => {
		selectedCredential = credential;
	};

	const { vps, post_without_vp } = $verificationStore;

	const verify = async () => {
		verificationStore.set({
			...$verificationStore,
			post_without_vp: {
				...post_without_vp,
				body: {
					...post_without_vp.body,
					vp: selectedCredential!
				}
			}
		});
		await goto('/verification');
	};
</script>

<HeaderWithBackButton>
	{m.Verification()}
</HeaderWithBackButton>

<ion-content>
	<div class="ion-padding flex h-full flex-col justify-between">
		<d-vertical-stack>
			<d-page-description
				title={'Select credential:'}
				description="You have 2 credentials with the same attributes, which one do you wanna use?"
			/>
			<d-vertical-stack>
				{#await getCredentialsbySdjwts(vps) then credentials}
					{#each credentials as credential, index}
						<div
							class={selectedCredential === credential.sdJwt
								? 'rounded-lg border-2 border-solid border-accent'
								: ''}
						>
							<d-credential-service
								name={credential.display_name}
								issuer={credential.issuer}
								organization={credential.issuerUrl}
								logoSrc={credential.logo.url}
								on:click={() => selectCredential(credential.sdJwt)}
								aria-hidden
							/>
						</div>
					{/each}
				{/await}
			</d-vertical-stack>
		</d-vertical-stack>
		<d-vertical-stack class="pb-24">
			<d-button on:click={verify} aria-hidden expand color="accent">{m.Verify()}</d-button>
			<d-button expand aria-hidden>{m.Decline()}</d-button>
		</d-vertical-stack>
	</div>
</ion-content>
