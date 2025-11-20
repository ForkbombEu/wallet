<script lang="ts">
	import HeaderWithBackButton from '$lib/components/molecules/HeaderWithBackButton.svelte';
	import { m, goto } from '$lib/i18n';
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
	import DebugPopup from '$lib/components/organisms/debug/DebugPopup.svelte';
	import { debugDismiss } from '$lib/components/organisms/debug/debug';
	import FingerPrint from '$lib/assets/lottieFingerPrint/FingerPrint.svelte';

	type Verification = {
		result: {
			result: {
				result: VerificationResponse;
				status: string;
			};
		};
		logs: string;
	};

	type SelectedCredentials = number[][][]

	export let data;
	const { credentials, verifier } = data;

	let selectedCredential: SelectedCredentials = [];

	let verification: Verification;
	let scrollBox: HTMLDivElement;
	let loading = false;

	const { vps, post_url, state } = $verificationStore;
	const verificationFailed = m.Verification_failed();

	const selectCredential = (cred: number, cred_set: number, cred_id: number, claim_set: number) => {
		selectedCredential[cred] ||= []
		selectedCredential[cred][cred_set] ||= []
		selectedCredential[cred].forEach((_, i) => {
			if (i !== cred_set) delete selectedCredential[cred][i]
		})
		selectedCredential[cred][cred_set][cred_id] = claim_set;
		// getSortedCredentials();
		// scrollBox.scrollIntoView({
		// 	behavior: 'smooth',
		// 	block: 'start'
		// });
	};
	const checkSelectedAllCredential = (sel: SelectedCredentials) => {
		return credentials.every((cred, i) => {
			if (!cred.required) return true;
			if (!Object.prototype.hasOwnProperty.call(sel, i)) return false
			return cred.claims.some((claim, j) =>
				Object.prototype.hasOwnProperty.call(sel[i], j) &&
				claim.every((_, k) => Object.prototype.hasOwnProperty.call(sel[i][j], k))
			)
		})
	}
	$: allCredentialsSelected = checkSelectedAllCredential(selectedCredential);

	const preparePresentation = () => {
		const vp_token: Record<string, [string | Record<string, any>]> = {};
		const prop: Record<string, string[]> = {};
		for (let i = 0; i < credentials.length; i++) {
			if (selectedCredential.hasOwnProperty(i)) {
				const j = selectedCredential[i].findIndex(v => v !== null && v !== undefined);
				for (let k = 0; k < credentials[i].claims[j].length; k++) {
					const index = selectedCredential[i][j][k]
					const key = credentials[i].claims[j][k][0];
					const card = credentials[i].claims[j][k][1][index].claims;
					const signed = credentials[i].claims[j][k][2][index];
					vp_token[key] = [signed];
					prop[key] = [...Object.keys(card)]
				}
			}
		}
		return { prop, vp_token };
	}

	const verify = async () => {
		if (!checkSelectedAllCredential(selectedCredential)) {
			return;
		}
		loading = true;
		try {
			const { prop, vp_token } = preparePresentation()
			verification = (await verifyCredential({
				url: post_url,
				body: {
					state,
					vp_token
				}
			})) as Verification;

			const responseSuccess = verification.result?.result?.status === '200';
			//@ts-ignore
			const responseRedirectUri = verification.result?.result?.result?.redirect_uri;
			await debugDismiss();
			const date = dayjs().toString();
			let feedback: Feedback = {};
			if ( !responseSuccess ) {
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
			const sid = verification.result?.result?.result?.complete_transaction_id
			verificationResultsStore.set({
				feedback,
				date,
				id: sid || '',
				success: responseSuccess
			});
			log(JSON.stringify(verification));
			for (const [_key, prop_array] of Object.entries(prop)) {
				await addVerificationActivity(sid, responseSuccess, post_url, prop_array);
			}
			if (responseRedirectUri) window.location.href = responseRedirectUri
			return await goto('/verification/results');
		} catch (e) {
			console.log(e)
			verificationResultsStore.set({
				feedback: negativeFeedback(verificationFailed, JSON.stringify(e)),
				date: dayjs().toString(),
				id: 'none',
				success: false
			});
			log(JSON.stringify(e));
			return await goto('/verification/results');
		}
	};

	const selected = (card: SelectedCredentials[number], cred_set: number, cred_id: number, claim_set: number) => {
		return Boolean(card)
			&& Boolean(card[cred_set])
			&& card[cred_set][cred_id] === claim_set
	}
	const opaque = (card: SelectedCredentials[number], cred_set: number, cred_id: number, claim_set: number) => {
		if(!card) return false;
		const claim = card[cred_set]?.[cred_id];
		if (card?.[cred_set] === undefined) return true
		if (claim === undefined) return false;
		return claim !== claim_set;
	}

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
				{#each credentials as vps_property, index}
					<div class="flex flex-col items-start gap-2.5 rounded-[5px] bg-secondary px-5 py-5">
					<d-badge class="self-end">{vps_property.required? m.required(): m.optional()}</d-badge>
					{#each vps_property.claims as cred_property, cred_set}
						{#each cred_property as [cred_key, claim_propery], cred_id}
							<d-text>{cred_key} {m.with_claims()}:</d-text>
							{#each claim_propery as claim_list, claim_set}
								<d-verification-card
									class:opacity-60={opaque(selectedCredential[index], cred_set, cred_id, claim_set)}
									class="transition-opacity duration-500 break-all"
									selected={selected(selectedCredential[index], cred_set, cred_id, claim_set)}
									relying-party={claim_list.issuer}
									flow={claim_list.type[1]}
									logo={claim_list.logo}
									on:click={() => selectCredential(index, cred_set, cred_id, claim_set)}
									aria-hidden
								>
									{#each Array.from(Object.entries(claim_list.claims)) as disclosure}
										<d-definition title={disclosure[0]} definition={disclosure[1]} dotted class="overflow-hidden text-ellipsis"></d-definition>
									{/each}
								</d-verification-card>
								{#if claim_set < claim_propery.length - 1}
									<d-text>{m.or()}:</d-text>
								{/if}
							{/each}
						{/each}
						{#if cred_set < vps_property.claims.length - 1}
							<d-text>{m.or()}:</d-text>
						{/if}
					{/each}
					</div>
				{/each}
				<div class="pb-56" />
			</d-vertical-stack>
		</d-vertical-stack>
	</div>
	{#if allCredentialsSelected}
		<div class="ion-padding fixed bottom-0 h-40 w-full bg-surface" transition:slide>
			<d-vertical-stack>
				<d-button
					on:click={verify}
					aria-hidden
					expand
					color="accent"
					disabled={!allCredentialsSelected || loading}>{m.Verify()}</d-button
				>
				<d-button expand aria-hidden>{m.Decline()}</d-button>
			</d-vertical-stack>
		</div>
	{/if}
	<DebugPopup />
</ion-content>
