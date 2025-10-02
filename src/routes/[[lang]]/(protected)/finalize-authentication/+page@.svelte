<script lang="ts">
	import { fly } from 'svelte/transition';
	import { thumbsUpOutline, thumbsDownOutline } from 'ionicons/icons';
	import { goto, m, r } from '$lib/i18n';
	import { setCredentialPreference, type Credential } from '$lib/preferences/credentials';
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
	const { code_verifier: codeVerifier } = parResult ?? {};

	const SUCCESS_REDIRECT_DELAY_MS = 2000;

	//
	type IssuanceState = 'loading' | 'success' | 'error';

	let state: IssuanceState = 'loading';
	let feedback: Feedback | undefined;
	let content: ScrollableNode;
	let isModalOpen = true;

	const credentialInfo = wn?.credential_requested?.display?.[0];
	//
	onMount(async () => {
		isModalOpen = !(await getDebugMode());
		await initializeIssuanceFlow();
	});

	async function initializeIssuanceFlow(): Promise<void> {
		if (!code || !codeVerifier || !wn) {
			const errorMessage = error_description || 'Required parameters are missing.';
			const errorDetails = error || 'issuance_failed';
			return await handleIssuanceError(errorMessage, errorDetails, true);
		}

		try {
			const credentialResponse = await fetchCredential();
			const credentialId = await processAndSaveCredential(credentialResponse);

			state = 'success';

			setTimeout(() => {
				handleIssuanceSuccess(credentialId);
			}, SUCCESS_REDIRECT_DELAY_MS);
		} catch (e: unknown) {
			const errorMessage = e instanceof Error ? e.message : String(e);
			await handleIssuanceError(errorMessage, 'credential_fetch_error');
		}
	}

	async function handleIssuanceError(
		message: string,
		errorType: string,
		isInitialError = false
	): Promise<void> {
		state = 'error';
		isModalOpen = false;
		feedback = { type: 'error', message: message, feedback: errorType };
		content?.scrollToTop();

		if (isInitialError) {
			window.parent.postMessage({ type: 'decline-to-home' }, '*');
			await addActivity({
				type: 'notIssuedCredential',
				at: dayjs().unix(),
				name: credentialInfo?.name || 'Unknown Credential',
				logo: credentialInfo?.logo || { uri: '', alt_text: 'No Logo' },
				description: credentialInfo?.description || 'Unknown Description',
				issuer: credentialInfo?.issuer || 'Unknown Issuer',
				displayName: credentialInfo?.name || 'Unknown Display Name'
			});
		}
	}

	async function fetchCredential(): Promise<CredentialResult> {
		if (!wn || !codeVerifier || !code) {
			throw new Error('Cannot fetch credential due to missing parameters.');
		}
		return await askCredential(code, wn.credential_parameters, codeVerifier);
	}

	async function processAndSaveCredential(response: CredentialResult): Promise<number> {
		if (!response || !response.credentials || response.credentials.length === 0) {
			throw new Error('Invalid credential response received.');
		}

		const credentialPayload = await mapResponseToCredentialPayload(response);
		if (!credentialPayload) {
			throw new Error('Unsupported credential format.');
		}

		const savedCredential = await setCredentialPreference(credentialPayload);
		await addActivity({ at: dayjs().unix(), id: savedCredential.id, type: 'credential' });

		return savedCredential.id;
	}

	async function mapResponseToCredentialPayload(
		response: CredentialResult
	): Promise<Omit<Credential, 'id'> | null> {
		const commonPayload = {
			configuration_ids: $credentialOfferStore!.credential_configuration_ids,
			display_name: credentialInfo!.name,
			issuer: credentialInfo!.issuer,
			description: credentialInfo!.description,
			logo: credentialInfo!.logo,
			verified: false
		};

		if (response.type === 'sdjwt') {
			const credential = response.credentials[0].credential;

			const decoded = await decodeSdJwt(credential);
			return {
				...commonPayload,
				type: 'sdjwt',
				//@ts-ignore
				sdJwt: credential,
				issuerUrl: decoded.credential.jwt.payload.iss,
				expirationDate: decoded.credential.jwt.payload.exp
			};
		}

		if (response.type === 'ldp_vc') {
			const credential = response.credentials[0].credential;

			return {
				...commonPayload,
				type: 'ldp_vc',
				// @ts-ignore
				ldpVc: credential,
				issuerUrl: credential.issuer,
				expirationDate: dayjs(credential.validUntil).unix()
			};
		}

		return null;
	}

	async function handleIssuanceSuccess(credentialId: number): Promise<void> {
		isModalOpen = false;
		if (isWeb) {
			window.parent.postMessage({ type: 'credential', action: 'finalized', id: credentialId }, '*');
		} else {
			await goto(`/${credentialId}/credential-detail`);
		}
	}
</script>

<ion-content fullscreen class="ion-padding h-screen" bind:this={content}>
	{#if state === 'error'}
		<div class="ion-padding flex h-full flex-col justify-between py-10">
			<d-feedback {...feedback} class="mb-4"></d-feedback>
			<div class="ion-padding flex w-full flex-col gap-2">
				<ion-icon icon={thumbsDownOutline} class="mx-auto my-6 text-9xl text-red-400"></ion-icon>
				<d-text class="mx-auto break-words">
					{m.credential_issuance_failed()}
				</d-text>
			</div>
			<d-button expand href={r('/home')}>{m.Home()}</d-button>
		</div>
	{/if}

	<ion-modal is-open={isModalOpen} backdrop-dismiss={false} transition:fly>
		<ion-content class="ion-padding">
			<div class="flex h-full flex-col items-center justify-center text-center">
				{#if state === 'loading'}
					<h1 class="mb-4 text-2xl font-semibold">{m.We_are_generating_this_credential()}</h1>
					<d-credential-card
						name={credentialInfo?.name}
						issuer={credentialInfo?.name}
						description={credentialInfo?.description}
						logoSrc={credentialInfo?.logo.uri}
					/>
					<div class="mt-8">
						<FingerPrint />
					</div>
				{:else if state === 'success'}
					<ion-icon icon={thumbsUpOutline} class="my-6 text-9xl text-green-400" />
					<h1 class="text-2xl font-semibold">{m.credential_issuance_succeeded()}</h1>
					<d-text class="mt-2">{m.you_will_be_redirected_shortly()}</d-text>
				{/if}
			</div>
		</ion-content>
	</ion-modal>
	<DebugPopup />
</ion-content>
