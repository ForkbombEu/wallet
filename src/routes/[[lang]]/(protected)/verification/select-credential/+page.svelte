<script lang="ts">
	import HeaderWithBackButton from '$lib/components/molecules/HeaderWithBackButton.svelte';
	import { m } from '$lib/i18n';
	import { decodeSdJwt } from '$lib/openId4vci';
	import { flip } from 'svelte/animate';
	import { sineInOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import type { Credential } from '$lib/preferences/credentials';
	import type { Feedback } from '$lib/utils/types.js';
	import { verificationStore } from '$lib/verificationStore.js';
	import dayjs from 'dayjs';
	import { log } from '$lib/log.js';
	import { addVerificationActivity } from '$lib/preferences/activity.js';
	import { verifyCredential } from '$lib/components/organisms/scanner/tools.js';
	import { negativeFeedback } from '$lib/utils/index.js';

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

	let selectedCredential: string | undefined =
		credentials.length === 1 ? credentials[0].sdJwt : undefined;

	let feedback: Feedback = {};
	let verificationResponse: VerificationResponse;
	let date = '';
	let verified: boolean;
	let success: boolean;
	let verifyIsClicked = false;
	let scrollBox: HTMLDivElement;

	const { info, post_without_vp } = $verificationStore;
	const verificationFailed = 'verification failed';

	const selectCredential = (credential: string | undefined) => {
		selectedCredential = credential;
		scrollBox.scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		});
	};

	const verify = async () => {
		verifyIsClicked = true;
		try {
			verificationResponse = (await verifyCredential({
				...post_without_vp,
				body: {
					...post_without_vp.body,
					vp: selectedCredential!
				}
			})) as VerificationResponse;
			verified = true;
			success = verificationResponse.result.result.result.server_response.status === '200';
			date = dayjs().toString();
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
			await addVerificationActivity(post_without_vp.body.id, info, success);
			log(JSON.stringify(verificationResponse));
		} catch (e) {
			verified = true;
			date = dayjs().toString();
			success = false;
			feedback = negativeFeedback(verificationFailed, JSON.stringify(e));
			log(JSON.stringify(e));
		}
		await addVerificationActivity(post_without_vp.body.id, info, success);
	};

	const sortedCredentials = () => {
		if (selectedCredential) {
			return [
				credentials.find((c) => c.sdJwt === selectedCredential),
				...credentials.filter((c) => c.sdJwt !== selectedCredential)
			] as Credential[];
		}
		return credentials;
	};
</script>

<HeaderWithBackButton lockOnBackButton>
	{m.Verification()}
</HeaderWithBackButton>

<ion-content>
	{#if verified}
		<div class="ion-padding">
			<d-feedback {...feedback} />
			<div class="flex w-full justify-around">
				<d-session-card
					sid={post_without_vp.body.id}
					{date}
					in-progress={!success}
					in-progress-message={m.tidy_royal_giraffe_stop()}
					success-message={m.just_sleek_ape_fall()}
					failure-message={m.teary_seemly_dragonfly_cheer()}
					session-message={m.petty_fit_flea_twirl()}
				/>
			</div>
		</div>
	{:else}
		<div class="ion-padding flex h-full flex-col justify-between" bind:this={scrollBox}>
			<d-vertical-stack>
				<d-page-description
					title={m.Select_credential()}
					description={m.novel_elegant_capybara_twist({ length: credentials.length })}
				/>
				<d-vertical-stack>
					{#each sortedCredentials() as credential, index (credential.sdJwt)}
						<d-verification-card
							class:opacity-60={selectedCredential && selectedCredential !== credential.sdJwt}
							class="transition-opacity duration-500"
							selected={selectedCredential === credential.sdJwt}
							relying-party={credential.issuerUrl}
							verifier={credential.issuer}
							logo={credential.logo.url}
							flow={credential.display_name}
							on:click={() => selectCredential(credential.sdJwt)}
							aria-hidden
							animate:flip={{ duration: 400, easing: sineInOut }}
						>
							{#await decodeSdJwt(credential.sdJwt) then sdJwt}
								{#each sdJwt.credential.disclosures as disclosure}
									<d-definition title={disclosure[1]} definition={disclosure[2]} dotted
									></d-definition>
								{/each}
							{/await}
						</d-verification-card>
					{/each}
					<div class="pb-56" />
				</d-vertical-stack>
			</d-vertical-stack>
		</div>
		{#if selectedCredential}
			<div class="ion-padding fixed bottom-0 h-40 w-full bg-surface" transition:slide>
				<d-vertical-stack>
					<d-button
						on:click={verify}
						aria-hidden
						expand
						color="accent"
						disabled={!selectedCredential}>{m.Verify()}</d-button
					>
					<d-button expand aria-hidden>{m.Decline()}</d-button>
				</d-vertical-stack>
			</div>
		{/if}
	{/if}
</ion-content>
