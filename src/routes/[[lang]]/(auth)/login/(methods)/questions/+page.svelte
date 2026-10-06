<script lang="ts">
	import WalletFeedback from '$lib/components/molecules/Feedback.svelte';
	import { createForm, Form } from '$lib/forms';
	import FormError from '$lib/forms/formError.svelte';
	import { Input } from '$lib/forms';
	import { generateKeypair, type UserChallengesAnswers } from '$lib/keypairoom';

	import CopyButton from '$lib/components/copyButton.svelte';
	import { goto, m, r } from '$lib/i18n';
	import { UserChallenges, type UserChallenge } from '$lib/keypairoom';
	import { setKeypairPreference } from '$lib/preferences/keypair.js';
	import { alertCircleOutline } from 'ionicons/icons';
	import { z } from 'zod';
	import { checkKeypairs, generateDid, saveUserPublicKeys, userEmailStore } from '../../_lib';
	import type { Feedback } from '$lib/utils/types';
	import { log } from '$lib/log';
	import FingerPrint from '$lib/assets/lottieFingerPrint/FingerPrint.svelte';
	import HeaderWithBackButton from '$lib/components/molecules/HeaderWithBackButton.svelte';
	import { setUserPassword } from '$lib/preferences/userPassword';

	//

	let { email: userEmail, registration, password } = $userEmailStore;

	//

	let seed: string | undefined = undefined;

	let loading: boolean = false;

	let feedback: Feedback = {};

	//

	export const questions: Array<{ id: UserChallenge; text: string }> = [
		{ id: UserChallenges.whereParentsMet, text: m.Where_did_your_parents_meet() },
		{ id: UserChallenges.nameFirstPet, text: m.What_is_the_name_of_your_first_pet() },
		{ id: UserChallenges.whereHomeTown, text: m.What_is_your_home_town() },
		{ id: UserChallenges.nameFirstTeacher, text: m.What_is_the_name_of_your_first_teacher() },
		{
			id: UserChallenges.nameMotherMaid,
			text: m.What_is_the_surname_of_your_mother_before_wedding()
		}
	];

	//

	export const answersSchemaError = m.AT_LEAST_THREE_QUESTIONS();

	export const answersSchema = z
		.object({
			[UserChallenges.whereParentsMet]: z.string(),
			[UserChallenges.nameFirstPet]: z.string(),
			[UserChallenges.whereHomeTown]: z.string(),
			[UserChallenges.nameFirstTeacher]: z.string(),
			[UserChallenges.nameMotherMaid]: z.string()
		})
		.partial()
		.refine((v) => {
			return Object.values(v).filter((v) => Boolean(v)).length >= 3;
		}, answersSchemaError);

	//
	const form = createForm({
		schema: answersSchema,
		onSubmit: async ({ form }) => {
			if (loading) return;
			try {
				feedback = { feedback: '' };
				loading = true;
				const formattedAnswers = convertUndefinedToNullString(form.data);
				const keypair = await generateKeypair(
					userEmail!,
					formattedAnswers as UserChallengesAnswers
				);
				await setKeypairPreference(keypair);
				if (registration) await saveUserPublicKeys();
				if (!registration) await checkKeypairs();
				await generateDid();
				seed = keypair.seed;
				await setUserPassword(password!);
				loading = false;
			} catch (e) {
				loading = false;
				feedback = {
					type: 'error',
					feedback: registration
						? m.Questions_registration_failed_help()
						: m.Questions_failed_help()
				};
				log(String(e));
				throw new Error('KEYRING_GENERATION_ERROR');
			}
		}
	});

	// Zencode requires undefined js value in input data to be set as 'null' (as a string)
	const ALL_CHALLENGES = Object.values(UserChallenges) as string[];
	function convertUndefinedToNullString(
		record: Record<string, string | undefined>
	): Record<string, string> {
		const result: Record<string, string> = {};
		for (const key of ALL_CHALLENGES) {
			result[key] = record[key] || 'null';
		}
		return result;
	}

	const answers = form.form;
	$: answeredQuestions = Object.values($answers).filter(Boolean).length;

	const goToWallet = () => {
		goto('/wallet', undefined);
	};
</script>

<d-loading {loading} message={m.Generating_Keypair_()}>
	<FingerPrint />
</d-loading>
<HeaderWithBackButton>
	{m.SECURITY_QUESTIONS()}
</HeaderWithBackButton>

<div class="auth-task">
	<WalletFeedback {...feedback} />

	{#if !seed}
		<d-vertical-stack>
			<d-heading size="s" level={1}>{m.Answer_to_these_questions()}</d-heading>
			<p class="text-on-alt">
				{m.Authentication_step({ current: registration ? 3 : 2, total: registration ? 3 : 2 })}
			</p>
			<p aria-live="polite" aria-atomic="true">
				{m.Questions_progress({ count: answeredQuestions })}
			</p>
			<d-text size="l"
				>{m.to_ensure_the_security_of_your_account_and_simplify_key_recovery_please_answer_the_following_questions_()}</d-text
			>
		</d-vertical-stack>

		<Form {form} id="questions" formClass="flex w-full flex-col gap-4 rounded bg-surface pb-2">
			<div class="flex gap-2">
				<d-text size="l" class="text-error"> <ion-icon icon={alertCircleOutline} /></d-text>
				<d-text
					>{m.Please_choose_both_secure_and_easily_memorable_answers_Your_answers_will_be_casesensitive_()}</d-text
				>
			</div>
			<div class="space-y-6">
				<div class="space-y-3">
					{#each questions as question}
						<Input {form} fieldPath={question.id} label={question.text} />
					{/each}
				</div>

				<FormError {form} let:errorMessage>
					<ion-item>
						<ion-text color="danger">
							{errorMessage}
						</ion-text>
					</ion-item>
				</FormError>
			</div>
		</Form>
		<d-button
			color="accent"
			type="submit"
			form="questions"
			expand
			disabled={answeredQuestions < 3 || loading}
		>
			{m.Next()}
		</d-button>
	{:else}
		<div class="flex flex-col gap-6">
			<div>
				<d-vertical-stack>
					<d-heading size="s">{m.Passphrase_save_title()}</d-heading>
					<d-text size="l">{m.Wallet_keys_ready()}</d-text>
				</d-vertical-stack>

				<div class="flex w-full flex-col space-y-8 pb-6 pt-4">
					<div class="flex flex-col gap-6">
						<div>
							<d-text>{m.Passphrase_label()}</d-text>
							<div class="rounded-lg border border-on bg-highlight p-4 font-mono">
								<div>
									{seed}
								</div>
							</div>
						</div>

						<CopyButton textToCopy={seed}>{m.Copy_seed()}</CopyButton>

						<div class="flex gap-2">
							<d-text size="l" class="text-error"> <ion-icon icon={alertCircleOutline} /></d-text>
							<d-text>{m.Passphrase_save_warning()}</d-text>
						</div>
					</div>
				</div>
			</div>
			<div class="flex flex-col gap-3 pb-4">
				<d-text size="m">{m.Recovery_options_help()}</d-text>
				<d-button color="accent" on:click={goToWallet} expand>{m.Go_to_wallet()}</d-button>
			</div>
		</div>
	{/if}
</div>
