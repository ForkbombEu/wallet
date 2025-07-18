<script lang="ts">
	import Modal from '$lib/components/molecules/Modal.svelte';
	import { goto, m } from '$lib/i18n';
	import { decodeSdJwt } from '$lib/openId4vci';
	import { removeCredentialPreference } from '$lib/preferences/credentials';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import HeaderWithBackButton from '$lib/components/molecules/HeaderWithBackButton.svelte';

	export let data: any;
	const { credential } = data;

	const isNestedDisclosure = (disclosure: Array<string | Record<string, string>>) => {
		return typeof disclosure[2] === 'object';
	};

	const openModal = () => {
		pushState('', {
			isModalOpen: true
		});
	};
	const closeModal = () => {
		window.history.back();
	};

	const deleteCredential = async () => {
		window.history.back();
		await removeCredentialPreference(credential.id);
		await goto('/wallet');
	};
</script>

<HeaderWithBackButton>
	{m.Credential_detail()}
</HeaderWithBackButton>
<ion-content fullscreen class="ion-padding h-full">
	<div class="flex h-full flex-col gap-8">
		<d-vertical-stack>
			<div class="flex items-center gap-2 text-xl font-semibold not-italic text-on">
				<d-avatar src={credential.logo.uri} alt={credential.logo.alt_text} shape="square"
				></d-avatar>
				<d-heading class="font-semibold" size="xs">
					{credential.display_name}
				</d-heading>
			</div>
			<d-text class="text-on-alt">{credential.description}</d-text>
			<div class="flex flex-col">
				<d-text
					>{m.Issued_by()}:
					<span class="font-semibold">{credential.issuer}</span></d-text
				>
				<d-text size="xs" class="truncate font-medium">@{credential.issuerUrl}</d-text>
			</div>
		</d-vertical-stack>
		<div class="flex h-full flex-grow flex-col justify-between pb-16">
			<d-vertical-stack>
				<d-heading size="xs" class="font-bold"> {m.Claims()} </d-heading>
				<d-vertical-stack>
					{#if credential.type === 'ldp_vc'}
						{#each Array.from(Object.entries(credential.ldpVc.credentialSubject)) as disclosure}
							<d-definition title={disclosure[0]} definition={disclosure[1]}></d-definition>
						{/each}
					{:else if credential.type === 'sdjwt'}
						{#await decodeSdJwt(credential.sdJwt) then sdjwt}
							{#each sdjwt.credential.disclosures as disclosure}
								{#if isNestedDisclosure(disclosure)}
									<d-text size="xs">{disclosure[1]}</d-text>
									<div class=" border-2 border-stroke p-1">
										{#each Object.entries(disclosure[2]) as [key, value]}
											<d-definition title={key} definition={value}></d-definition>
										{/each}
									</div>
								{:else}
									<d-definition title={disclosure[1]} definition={disclosure[2]}></d-definition>
								{/if}
							{/each}
						{/await}
					{/if}
				</d-vertical-stack>
			</d-vertical-stack>
			<div class="flex flex-col">
				<d-button expand color="accent" on:click={() => goto('/wallet')} aria-hidden
					>{m.Close()}</d-button
				>
				<d-button expand color="primary" on:click={openModal} aria-hidden>{m.Delete()}</d-button>
			</div>
		</div>
		<Modal isModalOpen={$page.state.isModalOpen} closeCb={closeModal}>
			<d-text>{m.If_you_continue_the_credential_will_be_permanently_deleted()}</d-text>
			<div class="flex flex-col">
				<d-button expand color="primary" on:click={deleteCredential} aria-hidden
					>{m.Continue()}</d-button
				>
				<d-button expand color="accent" on:click={closeModal} aria-hidden>{m.cancel()}</d-button>
			</div>
		</Modal>
	</div>
</ion-content>
