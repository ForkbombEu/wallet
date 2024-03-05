<script lang="ts">
	import JSONSchemaForm from '$lib/JSONSchemaForms/JSONSchemaForm.svelte';
	import JSONSchemaParser from '$lib/JSONSchemaForms/JSONSchemaParser.svelte';
	import ErrorDisplay from '$lib/components/errorDisplay.svelte';
	import { fly } from 'svelte/transition';
	import { thumbsUpOutline } from 'ionicons/icons';
	import { goto } from '$lib/i18n';
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	import { m } from '$lib/i18n';
	import Header from '$lib/components/molecules/Header.svelte';
	import { setCredentialPreference } from '$lib/preferences/credentials';
	export let data: any;
	const { credential } = data;
	let isModalOpen: boolean = false;
	let isCredentialVerified: boolean = false;
	import { page } from '$app/stores';
	import { askCredential } from '$lib/openId4vci';

	const url = $page.url;
	const service = url.searchParams.get('service');
	let serviceResponse: any;

	function getRandomExpirationDate() {
		const currentDate = new Date();
		const futureDate = new Date(
			currentDate.getFullYear() + Math.floor(Math.random() * 5),
			Math.floor(Math.random() * 12),
			Math.floor(Math.random() * 28) + 1
		);

		const year = futureDate.getFullYear();
		const month = (futureDate.getMonth() + 1).toString().padStart(2, '0');
		const day = futureDate.getDate().toString().padStart(2, '0');

		return `${year}-${day}-${month}`;
	}

	const getCredential = async () => {
		isModalOpen = true;
		if (service) {
			const parsedService = JSON.parse(service);
			const res = await askCredential(parsedService);
			serviceResponse = await res.json();
		}
		setTimeout(() => {
			isCredentialVerified = true;
			setCredentialPreference({
				id: credential.id,
				name: credential.name,
				issuer: credential.issuer,
				description: credential.description,
				verified: Boolean(Math.random() < 0.6), // 80% chance of being verified
				expirationDate: getRandomExpirationDate()
			});
			setTimeout(async () => {
				isModalOpen = false;
				await goto(`/${credential.id}/credential-detail`);
			}, 3000);
		}, 5000);
	};
</script>

<Header>{m.Credential_offer()}</Header>

<ion-content fullscreen class="ion-padding">
	<div class="flex h-full flex-col justify-between pb-16">
		<div>
			<div class="flex items-center gap-2 text-xl font-semibold not-italic text-on">
				<d-avatar name={credential.name}></d-avatar>
				<d-heading size="s">{credential.name}</d-heading>
			</div>
			<div class="mt-2 flex flex-col gap-2">
				<d-text size="l">{credential.expand.templates[0].name}</d-text>
				<div class="flex flex-col gap-4">
					<d-text size="s"
						>Lorem ipsum dolor sit amet consectetur. Leo ultricies pellentesque morbi in eu metus
						commodo felis. Pellentesque facilisis a auctor enim lectus. Nulla dolor cras viverra
						massa.</d-text
					>
				</div>
			</div>
		</div>

		<div class="rounded-md bg-primary p-4">
			<JSONSchemaParser schema={credential.expand.templates[0].schema} let:schema>
				<JSONSchemaForm {schema} onSubmit={getCredential} id="schemaForm" />
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
							name={credential.name}
							issuer={credential.issuer}
							description={credential.description}
						/>
						<LottiePlayer
							src="https://assets2.lottiefiles.com/packages/lf20_wxUJzo.json"
							autoplay={true}
							loop={true}
							renderer="svg"
							background="transparent"
						/>
					{:else}
						<div class="flex w-full justify-around">
							<ion-icon icon={thumbsUpOutline} class="mx-auto my-6 text-9xl text-green-400"
							></ion-icon>
							<pre>
								{JSON.stringify(serviceResponse, null, 2)}
							</pre>
						</div>
					{/if}
				</div>
			</div>
		</ion-content>
	</ion-modal>
</ion-content>
