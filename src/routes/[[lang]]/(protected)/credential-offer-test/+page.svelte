<script lang="ts">
	import JSONSchemaForm from '$lib/JSONSchemaForms/JSONSchemaForm.svelte';
	import JSONSchemaParser from '$lib/JSONSchemaForms/JSONSchemaParser.svelte';
	import ErrorDisplay from '$lib/components/errorDisplay.svelte';
	import { fly } from 'svelte/transition';
	import { thumbsUpOutline } from 'ionicons/icons';
	import { goto } from '$lib/i18n';
	//@ts-ignore
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	import { m } from '$lib/i18n';
	import Header from '$lib/components/molecules/Header.svelte';
	import { setCredentialPreference } from '$lib/preferences/credentials';
	import { holderQrToWellKnown, type CredentialResult, type QrToWellKnown } from '$lib/openId4vci';
	import { page } from '$app/stores';
	import { askCredential, getKeys } from '$lib/openId4vci';
	import type { Service } from '$lib/components/organisms/scanner/tools';
	import { log } from '$lib/log';
	import type { Feedback } from '$lib/utils/types';
	import { getLottieAnimation } from '$lib/getLottieAnimation';

	let isModalOpen: boolean = false;
	let isCredentialVerified: boolean = false;
	let serviceResponse: CredentialResult;

	//

	const url = $page.url;
	const service = url.searchParams.get('service');
	const parsedService = JSON.parse(service!) as Service;
	const qrToWellKnown = async () => await holderQrToWellKnown(parsedService);

	let feedback: Feedback = {};

	//

	const getCredential = async (formData: any, qrToWellKnown: QrToWellKnown) => {
		isModalOpen = true;
		try {
			serviceResponse = await askCredential(await getKeys(), qrToWellKnown, formData);
			if (!serviceResponse) return (isModalOpen = false);
			isCredentialVerified = true;
			log('serviceResponse: (fine chain)', serviceResponse);
		} catch (e) {
			isCredentialVerified = false;
			isModalOpen;
			feedback = {
				type: 'error',
				message: String(e),
				feedback: 'error while getting credential'
			};
		}

		setTimeout(async () => {
			const savedCredential = await setCredentialPreference({
				configuration_ids: parsedService.credential_configuration_ids,
				display_name: qrToWellKnown.credential_requested.display[0].name,
				sdJwt: serviceResponse.credential,
				issuer: qrToWellKnown.credential_issuer_information.display[0].name,
				description: qrToWellKnown.credential_requested.display[0].description,
				verified: false,
				expirationDate: '',
				logo: qrToWellKnown.credential_requested.display[0].logo
			});

			isModalOpen = false;
			await goto(`/${savedCredential.id}/credential-detail`);
		}, 2000);
	};
</script>

<Header>{m.Credential_offer()}</Header>

<ion-content fullscreen class="ion-padding">
	<d-feedback {...feedback} />
	{#await qrToWellKnown()}
		waiting
	{:then wn}
		{@const credentialInfo = wn['credential_requested']['display'][0]}
		{@const credentialSchema =
			wn['credential_requested']['credential_definition']['credentialSubject']}
		<div class="flex h-full flex-col justify-between pb-16">
			<div>
				<div class="flex items-center gap-2 text-xl font-semibold not-italic text-on">
					<d-avatar src={credentialInfo.logo.url} alt={credentialInfo.logo.alt_text}></d-avatar>
					<d-heading size="s">{credentialInfo.name}</d-heading>
				</div>
				<!-- <div class="mt-2 flex flex-col gap-2">
					<d-text size="l">{credential.expand.templates[0].name}</d-text>
					<div class="flex flex-col gap-4">
						<d-text size="s"
							>Lorem ipsum dolor sit amet consectetur. Leo ultricies pellentesque morbi in eu metus
							commodo felis. Pellentesque facilisis a auctor enim lectus. Nulla dolor cras viverra
							massa.</d-text
						>
					</div>
				</div> -->
			</div>

			<div class="rounded-md bg-primary p-4">
				<JSONSchemaParser schema={credentialSchema} let:schema>
					<JSONSchemaForm {schema} onSubmit={(d) => getCredential(d, wn)} id="schemaForm" />
					<svelte:fragment slot="error" let:error>
						<ErrorDisplay name={error.name} message={error.message} />
					</svelte:fragment>
				</JSONSchemaParser>
			</div>
			<div class="w-full">
				<d-button expand type="submit" form="schemaForm" aria-hidden
					>{m.Get_this_credential()}</d-button
				>
				<d-button expand href="/home">{m.Decline()}</d-button>
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
								<LottiePlayer
									src={getLottieAnimation()}
									autoplay={true}
									loop={true}
									renderer="svg"
									background="transparent"
									width={120}
								/>
							</div>
						{:else}
							<div class="flex w-full ion-padding flex-col gap-2">
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
	{/await}
</ion-content>
