<script lang="ts">
	import HeaderWithBackButton from '$lib/components/molecules/HeaderWithBackButton.svelte';
	import { m } from '$lib/i18n';
	import { slide } from 'svelte/transition';
	import type { Feedback } from '$lib/utils/types.js';
	import { verificationStore } from '$lib/verificationStore.js';
	import dayjs from 'dayjs';
	import { log } from '$lib/log.js';
	import { addVerificationActivity } from '$lib/preferences/activity.js';
	import { verifyCredential } from '$lib/components/organisms/scanner/tools.js';
	import { negativeFeedback } from '$lib/utils/index.js';
	import { verificationResultsStore } from '$lib/verificationResultsStore.js';
	import { goto } from '$app/navigation';
	import DebugPopup from '$lib/components/organisms/debug/DebugPopup.svelte';
	import { debugDismiss } from '$lib/components/organisms/debug/debug';
	import { onMount } from 'svelte';

	type VerificationResponse = {
		result: {
			result: {
				result: {
					body: {
						message: string;
						registrationToken: string;
					};
					server_response: {
						result: {
							error: {
								message: string;
								code: string;
							};
						};
						status: string;
					};
					url: string;
				};
				status: string;
			};
		};
		logs: string;
	};

	export let data;
	const { credentials } = data;

	let selectedCredential: number;

	let verificationResponse: VerificationResponse;
	let scrollBox: HTMLDivElement;

	const { vps, post_url } = $verificationStore;
	const verificationFailed = 'verification failed';

	const selectCredential = (credential: number) => {
		selectedCredential = credential;
		// getSortedCredentials();
		// scrollBox.scrollIntoView({
		// 	behavior: 'smooth',
		// 	block: 'start'
		// });
	};

	const verify = async () => {
		try {
			verificationResponse = (await verifyCredential({
				url: post_url,
				body: vps[selectedCredential].presentation
			})) as VerificationResponse;
			const success = verificationResponse.result.result.result.server_response.status === '200';
			await debugDismiss();
			const date = dayjs().toString();
			let feedback: Feedback = {};
			if (!success) {
				feedback = negativeFeedback(
					verificationFailed,
					JSON.stringify({
						serverResponse:
							verificationResponse.result.result.result.server_response.result.error.code,
						message: verificationResponse.result.result.result.server_response.result.error.message,
						logs: verificationResponse.logs
					})
				);
			}
			// verificationResultsStore.set({
			// 	feedback,
			// 	date,
			// 	id: post_without_vp.body.id,
			// 	success
			// });
			// await addVerificationActivity(post_without_vp.body.id, info, success);
			log(JSON.stringify(verificationResponse));
			return await goto('/verification/results');
		} catch (e) {
			// verificationResultsStore.set({
			// 	feedback: negativeFeedback(verificationFailed, JSON.stringify(e)),
			// 	date: dayjs().toString(),
			// 	id: post_without_vp.body.id,
			// 	success: false
			// });
			// log(JSON.stringify(e));
			// await addVerificationActivity(post_without_vp.body.id, info, false);
			return await goto('/verification/results');
		}
	};

	// let sortedCredentials: Credential[];
	// const getSortedCredentials = () => {
	// 	if (selectedCredential) {
	// 		sortedCredentials = [
	// 			credentials.find((c) => c.sdJwt === selectedCredential),
	// 			...credentials.filter((c) => c.sdJwt !== selectedCredential)
	// 		] as Credential[];
	// 		return;
	// 	}
	// 	sortedCredentials = credentials;
	// };
	// onMount(getSortedCredentials);
</script>

<HeaderWithBackButton>
	{m.Verification()}
</HeaderWithBackButton>

<ion-content>
	<div class="ion-padding flex h-full flex-col justify-between" bind:this={scrollBox}>
		<d-vertical-stack>
			<d-page-description
				title={m.Select_credential()}
				description={m.novel_elegant_capybara_twist({ length: credentials.length })}
			/>
			<d-vertical-stack>
				{#each credentials as credential, index}
					<d-verification-card
						class:opacity-60={selectedCredential && selectedCredential !== index}
						class="transition-opacity duration-500"
						selected={selectedCredential === index}
						relying-party={credential.issuer}
						verifier={credential.issuer}
						flow={credential.type}
						on:click={() => selectCredential(index)}
						aria-hidden
					>
						<!-- {#await decodeSdJwt(credential.sdJwt) then sdJwt}
								{#each sdJwt.credential.disclosures as disclosure}
									<d-definition title={disclosure[1]} definition={disclosure[2]} dotted
									></d-definition>
								{/each}
							{/await} -->
					</d-verification-card>
				{/each}
				<div class="pb-56" />
			</d-vertical-stack>
		</d-vertical-stack>
	</div>
	{#if selectedCredential !== undefined}
		<div class="ion-padding fixed bottom-0 h-40 w-full bg-surface" transition:slide>
			<d-vertical-stack>
				<d-button on:click={verify} aria-hidden expand color="accent">{m.Verify()}</d-button>
				<d-button expand aria-hidden>{m.Decline()}</d-button>
			</d-vertical-stack>
		</div>
	{/if}
	<DebugPopup />
</ion-content>
