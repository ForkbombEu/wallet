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
	import Pidgeon from '$lib/assets/Pidgeon.svelte';
	import Loading from '$lib/components/molecules/Loading.svelte';

	export let data;
	const { wn, authorizeUrl, parResult, feedbackData } = data;
	const codeVerifier = parResult?.code_verifier;
	let code: string | undefined;

	let iframeLoading = true;

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

	let isModalOpen: boolean = false;
	let isCredentialVerified: boolean = false;
	let serviceResponse: CredentialResult;

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

<d-header back-button backFunction={() => window.history.back()}>
	{m.Credential_offer()}
</d-header>

<ion-content fullscreen class="ion-padding" bind:this={content}>
	<d-feedback {...feedback} />
	{#if feedbackData}
		<d-feedback {...feedbackData} />
		<d-empty-state
			heading={m.The_service_seems_to_be_out_of_reach()}
			buttonText={m.Go_to_home()}
			href={r('/home')}
		>
			<Pidgeon />
		</d-empty-state>
	{:else}
		<div class="mt-2 flex min-h-full flex-col justify-between pb-14">
			<div>
				<div class="flex items-center gap-2 text-xl font-semibold not-italic text-on">
					<d-avatar src={credentialInfo?.logo.url} alt={credentialInfo?.logo.alt_text}></d-avatar>
					<d-heading size="s">{credentialInfo?.name}</d-heading>
				</div>
			</div>

			<div class="mt-6 rounded-md bg-white p-4">
				{#if iframeLoading}
					<div class="fixed left-0 top-0 opacity-90">
						<Loading />
					</div>
				{/if}
				<iframe
					src={authorizeUrl}
					width="100%"
					height="390px"
					title="authorization server"
					id="authorization server"
					on:load={() => {
						iframeLoading = false;
					}}
					loading="lazy"
				></iframe>
			</div>
			<div class="w-full">
				<d-button expand href={r('/home')}>{m.Decline()}</d-button>
			</div>
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
								logoSrc={credentialInfo?.logo.url}
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
