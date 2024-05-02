<script lang="ts">
	import Header from '$lib/components/molecules/Header.svelte';
	import { verifyCredential } from '$lib/components/organisms/scanner/tools';
	import { goto, m } from '$lib/i18n';
	import type { Feedback } from '$lib/utils/types';
	import { verificationStore } from '$lib/verificationStore';
	import WarningDot from '$lib/components/molecules/WarningDot.svelte';
	import dayjs from 'dayjs';
	import { log } from '$lib/log';

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
							message: string;
							response: string;
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

	let feedback: Feedback = {};
	let verificationResponse: VerificationResponse;
	let date = '';
	let verificated: boolean;
	let success: boolean;

	const { info, post } = $verificationStore;
	const { rp_name, verifier_name, asked_claims } = info;
	const { properties } = asked_claims;
	const propertiesArray = Object.values(properties);
	const verificationFailed = 'verification failed';

	const request = async () => {
		try {
			verificationResponse = (await verifyCredential(post)) as VerificationResponse;
			verificated = true;
			success = verificationResponse.result.result.result.server_response.status === '200';
			date = dayjs().toString();
			if (!success) {
				feedback = {
					type: 'error',
					message: JSON.stringify({
						logs: verificationResponse.logs,
						serverResponse: verificationResponse.result.result.result.server_response.result
					}),
					feedback: verificationFailed
				};
			}
			log(JSON.stringify(verificationResponse));
		} catch (e) {
			verificated = true;
			date = dayjs().toString();
			success = false;
			date = dayjs().toString();
			feedback = {
				type: 'error',
				message: JSON.stringify(e),
				feedback: verificationFailed
			};
			log(JSON.stringify(e));
		}
	};
	const decline = async () => {
		await goto('/');
	};
</script>

<Header>Verification</Header>

<ion-content fullscreen class="ion-padding">
	{#if verificated}
		<d-feedback {...feedback} class="break-all"/>

		<div class="flex w-full justify-around">
			<d-session-card sid={post.body.id} {date} {success} />
		</div>
	{:else}
		<div class="flex h-full flex-col justify-between gap-3 pb-16">
			<div>
				<div class="flex items-center gap-2 pb-0.5">
					<d-heading size="s">{verifier_name}</d-heading>
					<div
						class="flex h-6 items-center justify-center rounded-md border border-solid border-success px-2"
					>
						<d-text class="text-xs text-success">Verifier App</d-text>
					</div>
				</div>
				<d-heading size="xs">Is asking for verification</d-heading><br />
			</div>

			<div>
				<d-text size="l">About this verifications:</d-text>
				<div class="flex flex-col items-start gap-2.5 rounded-[5px] bg-primary px-5 py-5">
					<div class="flex items-center gap-2.5">
						<WarningDot />
						<d-text><b>Relying party:</b> {rp_name}</d-text>
					</div>
					<div class="flex items-center gap-2.5">
						<WarningDot />
						<d-text class="break-all"><b>Url:</b> {post.url}</d-text>
					</div>
				</div>
			</div>
			<div>
				<d-text size="l">Confirm data to be disclosed:</d-text>
				<div class="flex flex-col items-start gap-2.5 rounded-[5px] bg-primary px-5 py-5">
					{#each propertiesArray as property}
						<div class="flex items-center gap-2.5">
							<WarningDot />
							<d-text>{property.title}</d-text>
						</div>
					{/each}
				</div>
			</div>

			<div class="flex flex-col gap-2">
				<d-text>Are you sure?</d-text>
				<d-button
					on:click={() => request()}
					on:keydown={() => request()}
					aria-hidden
					expand
					color="accent">{m.Verify()}</d-button
				>
				<d-button on:click={decline} on:keydown={decline} expand aria-hidden>{m.Decline()}</d-button
				>
			</div>
		</div>
	{/if}
</ion-content>
