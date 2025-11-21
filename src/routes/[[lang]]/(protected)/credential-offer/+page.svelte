<script lang="ts">
	import { r } from '$lib/i18n';
	import { m } from '$lib/i18n';
	import type { Feedback, ScrollableNode } from '$lib/utils/types';
	import HeaderWithBackButton from '$lib/components/molecules/HeaderWithBackButton.svelte';
	import DebugPopup from '$lib/components/organisms/debug/DebugPopup.svelte';
	import { Browser } from '@capacitor/browser';
	import { isWeb } from '$lib/utils/index.js';

	export let data;
	const { wn, authorizeUrl, feedbackData } = data;

	async function handleRedirect() {
		if (!authorizeUrl) return;

		if(isWeb) window.location.href = authorizeUrl; // Web
		else await Browser.open({ url: authorizeUrl }); // iOS + Android
	}

	const credentialInfo = wn?.credential_requested['display'][0];

	let feedback: Feedback | undefined = {};
	let content: ScrollableNode;
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
				<d-text size="s">{m.Continue_and_open_an_external_site()}</d-text>
			</d-vertical-stack>
			<d-vertical-stack class="w-full">
				<d-button
					expand
					on:click={handleRedirect}
					color="accent"
					aria-hidden>{m.Continue()}</d-button
				>
				<d-button
					expand
					href={r('/home')}>{m.Decline()}</d-button
				>
			</d-vertical-stack>
		</div>
		<DebugPopup />
	{/if}
</ion-content>

<style>
	#authorization_server {
		position: relative;
		height: 100%;
		width: 100%;
	}
</style>
