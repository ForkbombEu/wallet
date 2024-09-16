<script lang="ts">
	import HeaderWithBackButton from '$lib/components/molecules/HeaderWithBackButton.svelte';
	import { m } from '$lib/i18n';

	let selectedCredential: number | undefined = undefined;
	const selectCredential = (credential: number | undefined) => {
		selectedCredential = credential;
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
				{#each ['over 18', 'medical issuance'] as name, index}
					<div
						class={selectedCredential === index
							? 'rounded-lg border-2 border-solid border-accent'
							: ''}
					>
						<d-credential-service
							{name}
							issuer="service.expand.credential_issuer.name"
							organization="service.expand.organization.name"
							logoSrc="service.logo"
							on:click={() => selectCredential(index)}
							on:keydown={() => selectCredential(index)}
							aria-hidden
						/>
					</div>
				{/each}
			</d-vertical-stack>
		</d-vertical-stack>
		<d-vertical-stack class="pb-24">
			<d-button on:click={() => {}} on:keydown={() => {}} aria-hidden expand color="accent"
				>{m.Verify()}</d-button
			>
			<d-button expand aria-hidden>{m.Decline()}</d-button>
		</d-vertical-stack>
	</div>
</ion-content>
