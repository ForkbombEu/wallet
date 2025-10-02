<script lang="ts">
	import { fly } from 'svelte/transition';
	import { thumbsUpOutline, thumbsDownOutline } from 'ionicons/icons';
	import { goto, m, r } from '$lib/i18n';
	import { setCredentialPreference } from '$lib/preferences/credentials';
	import { askCredential, decodeSdJwt, type CredentialResult } from '$lib/openId4vci';
	import { credentialOfferStore } from '$lib/credentialOfferStore';
	import type { Feedback, ScrollableNode } from '$lib/utils/types';
	import { addActivity } from '$lib/preferences/activity';
	import dayjs from 'dayjs';
	import FingerPrint from '$lib/assets/lottieFingerPrint/FingerPrint.svelte';
	import { onMount } from 'svelte';
	import { isWeb } from '$lib/utils/index.js';
	import DebugPopup from '$lib/components/organisms/debug/DebugPopup.svelte';
	import { getDebugMode } from '$lib/preferences/debug';

	export let data;
	const { error, error_description, code, wn, parResult } = data;
	const codeVerifier = parResult?.code_verifier;

	let isCredentialVerified: boolean | undefined;
	let serviceResponse: CredentialResult;
	let isOpen = true;

	onMount(async () => {
		if (await getDebugMode()) {
			isOpen = false;
		}
		if (code) {
			getCredential();
		} else {
			isCredentialVerified = false;
			feedback = {
				type: 'error',
				message: error_description || 'No code received from the authentication service.',
				feedback: error || 'Please try again.'
			};
			window.parent.postMessage({ type: 'decline-to-home' }, '*');
			await addActivity({
				type: 'notIssuedCredential',
				at: dayjs().unix(),
				name: wn!.credential_requested.display[0].name,
				logo: wn!.credential_requested.display[0].logo,
				description: wn!.credential_requested.display[0].description,
				issuer: wn!.credential_issuer_information.display[0].name,
				displayName: wn!.credential_requested.display[0].name
			});
		}
	});

	const credentialInfo = wn?.credential_requested['display'][0];

	let feedback: Feedback | undefined = {};
	let content: ScrollableNode;

	//

	const getCredential = async () => {
		if (!wn || !codeVerifier || !code) return;
		try {
			serviceResponse = await askCredential(code, wn.credential_parameters, codeVerifier);
			if (!serviceResponse) return;
			isCredentialVerified = true;
		} catch (e: unknown) {
			isCredentialVerified = false;
			feedback = {
				type: 'error',
				// @ts-ignore
				message: String(e?.message || e),
				feedback: 'error while getting credential'
			};
			content.scrollToTop();
		}
		setTimeout(async () => {
			if (!serviceResponse) return (isOpen = false);
			let id: number;
			if (serviceResponse.type === 'sdjwt') {
				const dsdjwt = await decodeSdJwt(serviceResponse.credentials[0].credential);
				const c = await setCredentialPreference({
					type: 'sdjwt',
					configuration_ids: $credentialOfferStore!.credential_configuration_ids,
					display_name: wn.credential_requested.display[0].name,
					sdJwt: serviceResponse.credentials[0].credential,
					issuer: wn.credential_issuer_information.display[0].name,
					issuerUrl: dsdjwt.credential.jwt.payload.iss,
					description: wn.credential_requested.display[0].description,
					verified: false,
					expirationDate: dsdjwt.credential.jwt.payload.exp,
					logo: wn.credential_requested.display[0].logo
				});
				id = c.id;
			} else if (serviceResponse.type === 'ldp_vc') {
				const c = await setCredentialPreference({
					type: 'ldp_vc',
					configuration_ids: $credentialOfferStore!.credential_configuration_ids,
					display_name: wn.credential_requested.display[0].name,
					ldpVc: serviceResponse.credentials[0].credential,
					issuer: wn.credential_issuer_information.display[0].name,
					issuerUrl: serviceResponse.credentials?.[0].credential.issuer,
					description: wn.credential_requested.display[0].description,
					verified: false,
					expirationDate: dayjs(serviceResponse.credentials[0].credential.validUntil).unix(),
					logo: wn.credential_requested.display[0].logo
				});
				id = c.id;
			} else {
				return (isOpen = false);
			}

			await addActivity({ at: dayjs().unix(), id, type: 'credential' });
			isOpen = false;
			if (isWeb) {
				return window.parent.postMessage({
					type: 'credential',
					action: 'finalized',
					id: id
				});
			}
			return await goto(`/${id}/credential-detail`);
		}, 2000);
	};
</script>

<ion-content fullscreen class="ion-padding h-screen" bind:this={content}>
	{#if isCredentialVerified === false}
	<div class="ion-padding py-10 flex h-full flex-col justify-between">
		<d-feedback {...feedback} class="mb-4"></d-feedback>
		<div class="ion-padding flex w-full flex-col gap-2">
			<ion-icon icon={thumbsDownOutline} class="mx-auto my-6 text-9xl text-red-400"></ion-icon>
			<d-text class="mx-auto break-words">
				{m.credential_issuance_failed()}
			</d-text>
		</div>
		<d-button expand href={r('/home')}>{m.Home()}</d-button>
	</div>
	{:else}
		<ion-modal is-open={isOpen} backdrop-dismiss={false} transition:fly class="visible">
			<ion-content class="ion-padding">
				<div class="flex h-full flex-col justify-around">
					<div>
						{#if isCredentialVerified === undefined}
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
						{:else if isCredentialVerified === true}
							<div class="ion-padding flex w-full flex-col gap-2">
								<ion-icon icon={thumbsUpOutline} class="mx-auto my-6 text-9xl text-green-400"
								></ion-icon>
								<d-text class="break-words"
									>{m.credential()}: {JSON.stringify(
										serviceResponse.credentials[0],
										null,
										2
									)}</d-text
								>
							</div>
						{/if}
					</div>
				</div>
			</ion-content>
		</ion-modal>
	{/if}
	<DebugPopup />
</ion-content>
