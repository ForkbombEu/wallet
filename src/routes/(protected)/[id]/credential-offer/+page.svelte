<script lang="ts">
	import Logo from '$lib/components/atoms/Logo.svelte';
	import JSONSchemaForm from '$lib/JSONSchemaForms/JSONSchemaForm.svelte';
	import JSONSchemaParser from '$lib/JSONSchemaForms/JSONSchemaParser.svelte';
	import ErrorDisplay from '$lib/components/errorDisplay.svelte';
	import { fly } from 'svelte/transition';
	import { thumbsUpOutline } from 'ionicons/icons';
	import { goto } from '$app/navigation';
	export let data: any;
	const { credential } = data;
	let isModalOpen: boolean = false;
	let isCredentialVerified: boolean = false;
	$: {
		if (isModalOpen) {
			setInterval(() => {
				isCredentialVerified = true;
				setInterval(() => {
					isModalOpen = false;
					goto("/home")
				}, 3000);
			}, 5000);
		}
	}
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
			<div class="text-on flex items-center gap-2 text-xl font-semibold not-italic">
				<d-avatar name={credential.name}></d-avatar>
				<span class="text-2xl font-semibold not-italic leading-[20.5px] tracking-[-0.5px]">{credential.name}</span>
			</div>
			<div class="mt-2 flex flex-col gap-2">
				<span class="text-on text-xl font-medium not-italic leading-[20.5px] tracking-[-0.5px]"
					>{credential.expand.templates[0].name}</span
				>
				<div class="flex flex-col gap-4">
					<span class="text-on-alt text-sm font-normal not-italic leading-[150%] tracking-[-0.5px]"
						>Lorem ipsum dolor sit amet consectetur. Leo ultricies pellentesque morbi in eu metus commodo felis.
						Pellentesque facilisis a auctor enim lectus. Nulla dolor cras viverra massa.</span
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
			<ion-button
				expand="block"
				on:click={() => {
					isModalOpen = true;
				}}>Get this credential</ion-button
			>
			<ion-button expand="block" href="/home">decline</ion-button>
		</div>
	</div>
	<ion-modal is-open={isModalOpen} backdrop-dismiss={false} transition:fly class="visible">
		<ion-content class="ion-padding">
			<div class="flex h-full flex-col justify-around">
				<div>
					{#if !isCredentialVerified}
						We are generating this credential
						<d-credential-card name={credential.name} issuer={credential.issuer} description={credential.description} />
					{:else}
						<ion-icon icon={thumbsUpOutline} class="mx-auto my-6 text-9xl text-green-400"></ion-icon>
					{/if}
				</div>
			</div>
		</ion-content>
	</ion-modal>
</ion-content>
