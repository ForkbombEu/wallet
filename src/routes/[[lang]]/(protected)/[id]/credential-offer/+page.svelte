<script lang="ts">
	import Logo from '$lib/components/atoms/Logo.svelte';
	import JSONSchemaForm from '$lib/JSONSchemaForms/JSONSchemaForm.svelte';
	import JSONSchemaParser from '$lib/JSONSchemaForms/JSONSchemaParser.svelte';
	import ErrorDisplay from '$lib/components/errorDisplay.svelte';
	import { fly } from 'svelte/transition';
	import { thumbsUpOutline } from 'ionicons/icons';
	import { goto } from '$app/navigation';
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	export let data: any;
	const { credential } = data;
	let isModalOpen: boolean = false;
	let isCredentialVerified: boolean = false;

	const getCredential = () => {
		isModalOpen = true;
		setTimeout(() => {
			isCredentialVerified = true;
			setTimeout(() => {
				isModalOpen = false;
				goto('/home');
			}, 3000);
		}, 5000);
	};
</script>

<ion-header>
	<ion-toolbar>
		<ion-title>
			<div class="flex items-center gap-2">
				<Logo />
				<h1 class="text-2xl">Credential offer</h1>
			</div>
		</ion-title>
	</ion-toolbar>
</ion-header>

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

		<JSONSchemaParser schema={credential.expand.templates[0].schema} let:schema>
			<JSONSchemaForm {schema} onSubmit={() => {}} />
			<svelte:fragment slot="error" let:error>
				<ErrorDisplay name={error.name} message={error.message} />
			</svelte:fragment>
		</JSONSchemaParser>
		<pre>{credential.expand.templates[0].schema}</pre>
		<div class="w-full">
			<ion-button expand="block" on:click={getCredential} on:keydown={getCredential} aria-hidden
				>Get this credential</ion-button
			>
			<d-button expand href="/home">decline</d-button>
		</div>
	</div>
	<ion-modal is-open={isModalOpen} backdrop-dismiss={false} transition:fly class="visible">
		<ion-content class="ion-padding">
			<div class="flex h-full flex-col justify-around">
				<div>
					{#if !isCredentialVerified}
						We are generating this credential
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
						</div>
					{/if}
				</div>
			</div>
		</ion-content>
	</ion-modal>
</ion-content>
