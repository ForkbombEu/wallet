<script lang="ts">
	import { fly } from 'svelte/transition';
	import { thumbsUpOutline } from 'ionicons/icons';
	import { goto, r } from '$lib/i18n';
	import { m } from '$lib/i18n';
	import Header from '$lib/components/molecules/Header.svelte';
	import { setCredentialPreference } from '$lib/preferences/credentials';
	import { askCredential, decodeSdJwt, type CredentialResult } from '$lib/openId4vci';
	import { credentialOfferStore } from '$lib/credentialOfferStore';
	import { log } from '$lib/log';
	import type { Feedback } from '$lib/utils/types';
	import { addActivity } from '$lib/preferences/activity';
	import dayjs from 'dayjs';
	import FingerPrint from '$lib/assets/lottieFingerPrint/FingerPrint.svelte';

	export let data;
	const { wn, authorizeUrl, parResult } = data;
	const codeVerifier = parResult.code_verifier;
	let code: string | undefined;

	window.addEventListener('message', function (event) {
		if (event.origin === window.location.origin) return;
		code = JSON.parse(event.data).code;
		console.log('Received data:', event.data);
	});

	const credentialInfo = wn['credential_requested']['display'][0];

	let isModalOpen: boolean = false;
	let isCredentialVerified: boolean = false;
	let serviceResponse: CredentialResult;

	let feedback: Feedback = {};

	//

	const getCredential = async () => {
		isModalOpen = true;
		try {
			serviceResponse = await askCredential(code!, wn.credential_parameters, codeVerifier);
			if (!serviceResponse) return (isModalOpen = false);
			isCredentialVerified = true;
			log(`serviceResponse: (fine chain): ${JSON.stringify(serviceResponse, null, 2)}`);
		} catch (e) {
			isCredentialVerified = false;
			isModalOpen = false;
			feedback = {
				type: 'error',
				message: String(e),
				feedback: 'error while getting credential'
			};
		}

		setTimeout(async () => {
			const dsdjwt = await decodeSdJwt(serviceResponse.credential);
			const { id } = await setCredentialPreference({
				configuration_ids: $credentialOfferStore.credential_configuration_ids,
				display_name: wn.credential_requested.display[0].name,
				sdJwt: serviceResponse.credential,
				issuer: wn.credential_issuer_information.display[0].name,
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

<Header>{m.Credential_offer()}</Header>

<ion-content fullscreen class="ion-padding">
	<d-feedback {...feedback} />
	<div class="flex min-h-full flex-col justify-between pb-14">
		<div>
			<div class="flex items-center gap-2 text-xl font-semibold not-italic text-on">
				<d-avatar src={credentialInfo.logo.url} alt={credentialInfo.logo.alt_text}></d-avatar>
				<d-heading size="s">{credentialInfo.name}</d-heading>
			</div>
		</div>

		<div class="mt-6 rounded-md bg-primary p-4">
			<iframe
				src={authorizeUrl}
				width="100%"
				height="500px"
				title="authorization server"
				id="authorization server"
			></iframe>
		</div>
		<div class="w-full">
			<d-button
				expand
				aria-hidden
				disabled={!Boolean(code)}
				on:click={Boolean(code) ? getCredential : () => {}}>{m.Get_this_credential()}</d-button
			>
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
							name={credentialInfo.name}
							issuer={credentialInfo.name}
							description={credentialInfo.name}
							logoSrc={credentialInfo.logo.url}
						/>
						<div class="mx-auto w-fit pt-8">
							<FingerPrint />
						</div>
					{:else}
						<div class="ion-padding flex w-full flex-col gap-2">
							<ion-icon icon={thumbsUpOutline} class="mx-auto my-6 text-9xl text-green-400"
							></ion-icon>
							<d-text class="break-words">credential: {serviceResponse.credential}</d-text>
							<d-text class="break-words">c_nonce: {serviceResponse.c_nonce}</d-text>
							<d-text class="break-words"
								>c_nonce_expires_in: {serviceResponse.c_nonce_expires_in}</d-text
							>
						</div>
					{/if}
				</div>
			</div>
		</ion-content>
	</ion-modal>
</ion-content>
