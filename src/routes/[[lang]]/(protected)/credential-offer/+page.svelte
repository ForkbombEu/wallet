<script lang="ts">
	import { fly } from 'svelte/transition';
	import { thumbsUpOutline } from 'ionicons/icons';
	import { goto, r } from '$lib/i18n';
	import { m } from '$lib/i18n';
	import { setCredentialPreference } from '$lib/preferences/credentials';
	import { askCredential, decodeSdJwt, type CredentialResult } from '$lib/openId4vci';
	import { credentialOfferStore } from '$lib/credentialOfferStore';
	import { log } from '$lib/log';
	import type { Feedback } from '$lib/utils/types';
	import { addActivity } from '$lib/preferences/activity';
	import dayjs from 'dayjs';
	import FingerPrint from '$lib/assets/lottieFingerPrint/FingerPrint.svelte';
	import HeaderWithBackButton from '$lib/components/molecules/HeaderWithBackButton.svelte';

	export let data;
	const { wn, authorizeUrl, parResult, feedbackData } = data;
	const codeVerifier = parResult?.code_verifier;

	let shouldContinue = false;

	let code: string | undefined;
	let iframeLoading = true;
	let isModalOpen: boolean = false;
	let isCredentialVerified: boolean = false;
	let serviceResponse: CredentialResult;

	window.addEventListener('message', async function (event) {
		if (event.origin === window.location.origin) return;
		try {
			code = JSON.parse(event.data).code;
			await getCredential();
		} catch {
			feedback = {
				type: 'error',
				message: event.data,
				feedback: 'Error authenticating with the service. Please try again.'
			};
			content.scrollToTop();
		}
	});

	const credentialInfo = wn?.credential_requested['display'][0];

	interface ScrollableNode extends Node {
		scrollToTop: () => void;
	}

	let feedback: Feedback | undefined = {};
	let content: ScrollableNode;

	//

	const getCredential = async () => {
		if (!wn || !codeVerifier || !code) return;
		isModalOpen = true;
		try {
			serviceResponse = await askCredential(code, wn.credential_parameters, codeVerifier);
			if (!serviceResponse) return (isModalOpen = false);
			isCredentialVerified = true;
			log(`serviceResponse: (fine chain): ${JSON.stringify(serviceResponse, null, 2)}`);
		} catch (e: unknown) {
			isCredentialVerified = false;
			isModalOpen = false;
			feedback = {
				type: 'error',
				message: String(e?.message || e),
				feedback: 'error while getting credential'
			};
			content.scrollToTop();
		}

		setTimeout(async () => {
			const dsdjwt = await decodeSdJwt(serviceResponse.credential);
			const { id } = await setCredentialPreference({
				configuration_ids: $credentialOfferStore.credential_configuration_ids,
				display_name: wn.credential_requested.display[0].name,
				sdJwt: serviceResponse.credential,
				issuer: wn.credential_issuer_information.display[0].name,
				issuerUrl: dsdjwt.credential.jwt.payload.iss,
				description: wn.credential_requested.display[0].description,
				verified: false,
				expirationDate: dsdjwt.credential.jwt.payload.exp,
				logo: wn.credential_requested.display[0].logo
			});

			await addActivity({ at: dayjs().unix(), id, type: 'credential' });

			isModalOpen = false;
			await goto(`/${id}/credential-detail`);
		}, 2000);
	};
</script>

<HeaderWithBackButton>
	{m.Credential_offer()}
</HeaderWithBackButton>

<ion-content fullscreen class="ion-padding" bind:this={content}>
	<d-feedback {...feedback} />
	{#if feedbackData}
		<d-feedback {...feedbackData} />
		<d-empty-state
			heading={m.The_service_seems_to_be_out_of_reach()}
			buttonText={m.Go_to_home()}
			href={r('/home')}
		>
			<d-illustration illustration="pidgeon" />
		</d-empty-state>
	{:else}
		<div class="flex h-full flex-col justify-between gap-4 pb-16">
			{#if !shouldContinue}
				<d-vertical-stack gap={4}>
					<d-vertical-stack>
						<div class="flex items-center gap-2 text-xl font-semibold not-italic text-on">
							<d-avatar
								name={credentialInfo?.name}
								src={credentialInfo?.logo.uri}
								alt={credentialInfo?.logo.alt_text}
								shape="square"
							></d-avatar>
							<d-heading class="font-semibold" size="xs">
								{credentialInfo?.name}
							</d-heading>
							<!-- <d-heading size="s">{credentialInfo?.name}</d-heading> -->
						</div>
						<d-text class="text-on-alt">{credentialInfo?.description}</d-text>
					</d-vertical-stack>
					<d-text
						>{m.Issued_by()}:
						<span class="font-semibold">{wn?.credential_issuer_information.display[0].name}</span
						></d-text
					>
				</d-vertical-stack>
			{:else}
				<div class="h-full rounded-md">
					<div class="fixed left-0 top-0 opacity-90">
						<d-loading loading={iframeLoading}>
							<FingerPrint />
						</d-loading>
					</div>
					<iframe
						src={authorizeUrl}
						width="100%"
						title="authorization server"
						id="authorization_server"
						on:load={() => {
							iframeLoading = false;
						}}
						loading="lazy"
					></iframe>
				</div>
			{/if}
			<d-vertical-stack class="w-full">
				{#if !shouldContinue}
					<d-text size="s">{m.Continue_and_open_an_external_site()}</d-text>
					<d-button
						expand
						on:click={() => (shouldContinue = true)}
						color="accent"
						on:keydown={() => (shouldContinue = true)}
						aria-hidden>{m.Continue()}</d-button
					>
				{/if}
				<d-button expand href={r('/home')}>{m.Decline()}</d-button>
			</d-vertical-stack>
		</div>

		<ion-modal is-open={isModalOpen} backdrop-dismiss={false} transition:fly class="visible">
			<ion-content class="ion-padding">
				<div class="flex h-full flex-col justify-around">
					<div>
						{#if !isCredentialVerified}
							{m.We_are_generating_this_credential()}
							<d-credential-card
								name={credentialInfo?.name}
								issuer={credentialInfo?.name}
								description={credentialInfo?.name}
								logoSrc={credentialInfo?.logo.uri}
							/>
							<div class="mx-auto w-fit pt-8">
								<FingerPrint />
							</div>
						{:else}
							<div class="ion-padding flex w-full flex-col gap-2">
								<ion-icon icon={thumbsUpOutline} class="mx-auto my-6 text-9xl text-green-400"
								></ion-icon>
								<d-text class="break-words">{m.credential()}: {serviceResponse.credential}</d-text>
								<d-text class="break-words">{'c_nonce'}: {serviceResponse.c_nonce}</d-text>
								<d-text class="break-words"
									>{'c_nonce_expires_in'}: {serviceResponse.c_nonce_expires_in}</d-text
								>
							</div>
						{/if}
					</div>
				</div>
			</ion-content>
		</ion-modal>
	{/if}
</ion-content>

<style>
	#authorization_server {
		position: relative;
		height: 100%;
		width: 100%;
	}
</style>
