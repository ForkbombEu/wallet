<script lang="ts">
	import { verifyCredential } from '$lib/components/organisms/scanner/tools';
	import { goto, m } from '$lib/i18n';
	import type { Feedback } from '$lib/utils/types';
	import { verificationStore } from '$lib/verificationStore';
	import dayjs from 'dayjs';
	import { log } from '$lib/log';
	import { addActivity, type Activity } from '$lib/preferences/activity';
	import HeaderWithBackButton from '$lib/components/molecules/HeaderWithBackButton.svelte';

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
	let verifyIsClicked = false;

	const { info, post } = $verificationStore;
	const { rp_name, verifier_name, asked_claims } = info;
	const { properties } = asked_claims;
	const propertiesArray = Object.values(properties);
	const verificationFailed = 'verification failed';

	const request = async () => {
		verifyIsClicked = true;
		let activity: Activity;
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
			activity = {
				type: 'verification',
				sid: post.body.id,
				at: dayjs().unix(),
				verifier_name,
				rp_name,
				properties: propertiesArray.map((property) => property.title),
				success
			};
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
			activity = {
				type: 'verification',
				sid: post.body.id,
				at: dayjs().unix(),
				verifier_name,
				rp_name,
				properties: propertiesArray.map((property) => property.title),
				success
			};
			log(JSON.stringify(e));
		}
		await addActivity(activity);
	};
	const decline = async () => {
		await goto('/');
	};
</script>

<HeaderWithBackButton>
	{m.Verification()}
</HeaderWithBackButton>

<ion-content fullscreen class="ion-padding">
	{#if verificated}
		<d-feedback {...feedback} class="break-all" />

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
						<d-text class="text-xs text-success">{m.Verifier_App()}</d-text>
					</div>
				</div>
				<d-heading size="xs">{m.Is_asking_for_verification()}</d-heading><br />
			</div>

			<div>
				<d-text size="l">{m.About_this_verifications()}</d-text>
				<div class="flex flex-col items-start gap-2.5 rounded-[5px] bg-primary px-5 py-5">
					<div class="flex items-center gap-2.5">
						<d-info-led type="warning" />
						<d-text><b>{m.Relying_party()}:</b> {rp_name}</d-text>
					</div>
					<div class="flex items-center gap-2.5">
						<d-info-led type="warning" />
						<d-text class="break-all"><b>{m.Url()}:</b> {post.url}</d-text>
					</div>
				</div>
			</div>
			<div>
				<d-text size="l">{m.Confirm_data_to_be_disclosed()}:</d-text>
				<div class="flex flex-col items-start gap-2.5 rounded-[5px] bg-primary px-5 py-5">
					{#each propertiesArray as property}
						<div class="flex items-center gap-2.5">
							<d-info-led type="warning" />
							<d-text>{property.title}</d-text>
						</div>
					{/each}
				</div>
			</div>

			<d-vertical-stack>
				<d-text>{m.Are_you_sure()}</d-text>
				<d-button
					on:click={() => request()}
					on:keydown={() => request()}
					disabled={verifyIsClicked}
					aria-hidden
					expand
					color="accent">{m.Verify()}</d-button
				>
				<d-button on:click={decline} on:keydown={decline} expand aria-hidden>{m.Decline()}</d-button
				>
			</d-vertical-stack>
		</div>
	{/if}
</ion-content>
