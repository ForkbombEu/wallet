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
	import {
		verificationResultsStore,
		type VerificationResponse
	} from '$lib/verificationResultsStore.js';
	import { goto } from '$app/navigation';
	import DebugPopup from '$lib/components/organisms/debug/DebugPopup.svelte';
	import { debugDismiss } from '$lib/components/organisms/debug/debug';
	import FingerPrint from '$lib/assets/lottieFingerPrint/FingerPrint.svelte';
	import { join } from 'lodash';

	type Verification = {
		result: {
			result: {
				result: VerificationResponse;
				status: string;
			};
		};
		logs: string;
	};

	export let data;
	const { credentials } = data;

	let selectedCredential: number;

	let verification: Verification;
	let scrollBox: HTMLDivElement;
	let loading = false;

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
		if (selectedCredential === undefined) {
			return;
		}
		loading = true;
		try {
			verification = (await verifyCredential({
				url: post_url,
				body: vps[selectedCredential].presentation
			})) as Verification;

			const responseSuccess = verification.result?.result?.status === '200';
			const success = verification.result?.result?.result?.output?.[0] === 'OK';
			await debugDismiss();
			const date = dayjs().toString();
			let feedback: Feedback = {};
			if (!responseSuccess || !success) {
				feedback = negativeFeedback(
					verificationFailed,
					JSON.stringify(
						{
							serverResponse: verification.result?.result?.result,
							logs: verification.logs
						},
						null,
						2
					)
				);
			}
			verificationResultsStore.set({
				feedback,
				date,
				id: verification.result?.result?.result?.complete_transaction_id || '',
				success: responseSuccess && success
			});
			log(JSON.stringify(verification));
			return await goto('/verification/results');
		} catch (e) {
			verificationResultsStore.set({
				feedback: negativeFeedback(verificationFailed, JSON.stringify(e)),
				date: dayjs().toString(),
				id: 'none',
				success: false
			});
			log(JSON.stringify(e));
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

<d-loading {loading}>
	<FingerPrint />
</d-loading>
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
						flow={credential.type[1]}
						on:click={() => selectCredential(index)}
						aria-hidden
					>
						{#each Array.from(Object.entries(credential.credentialSubject)) as disclosure}
							<d-definition title={disclosure[0]} definition={disclosure[1]} dotted class="overflow-hidden text-ellipsis"></d-definition>
						{/each}
					</d-verification-card>
				{/each}
				<div class="pb-56" />
			</d-vertical-stack>
		</d-vertical-stack>
	</div>
	{#if selectedCredential !== undefined}
		<div class="ion-padding fixed bottom-0 h-40 w-full bg-surface" transition:slide>
			<d-vertical-stack>
				<d-button
					on:click={verify}
					aria-hidden
					expand
					color="accent"
					disabled={selectedCredential === undefined || loading}>{m.Verify()}</d-button
				>
				<d-button expand aria-hidden>{m.Decline()}</d-button>
			</d-vertical-stack>
		</div>
	{/if}
	<DebugPopup />
</ion-content>
