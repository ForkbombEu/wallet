<script lang="ts">
	import { createForm, Form } from '$lib/forms';
	import FormError from '$lib/forms/formError.svelte';
	import { Input } from '$lib/forms';
	import { generateKeypair, type UserChallengesAnswers } from '$lib/keypairoom';

	import CopyButton from '$lib/components/copyButton.svelte';
	import { goto, m, r } from '$lib/i18n';
	import { UserChallenges as C, type UserChallenge } from '$lib/keypairoom';
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
		{ id: C.whereParentsMet, text: m.Where_did_your_parents_meet() },
		{ id: C.nameFirstPet, text: m.What_is_the_name_of_your_first_pet() },
		{ id: C.whereHomeTown, text: m.What_is_your_home_town() },
		{ id: C.nameFirstTeacher, text: m.What_is_the_name_of_your_first_teacher() },
		{ id: C.nameMotherMaid, text: m.What_is_the_surname_of_your_mother_before_wedding() }
	];

	//

	export const answersSchemaError = m.AT_LEAST_THREE_QUESTIONS();

	export const answersSchema = z
		.object({
			[C.whereParentsMet]: z.string(),
			[C.nameFirstPet]: z.string(),
			[C.whereHomeTown]: z.string(),
			[C.nameFirstTeacher]: z.string(),
			[C.nameMotherMaid]: z.string()
		})
		.partial()
		.refine((v) => {
			return Object.values(v).filter((v) => Boolean(v)).length >= 3;
		}, answersSchemaError);

	//
	const form = createForm({
		schema: answersSchema,
		onSubmit: async ({ form }) => {
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
				await setUserPassword(password!)
				loading = false;
			} catch (e) {
				loading = false;
				feedback = {
					type: 'error',
					message: String(e),
					feedback: 'error while generating keyring'
				};
				log(String(e));
				throw new Error('KEYRING_GENERATION_ERROR');
			}
		}
	});

	// Zencode requires undefined js value in input data to be set as 'null' (as a string)
	function convertUndefinedToNullString<T>(
		record: Record<string, T | undefined>
	): Record<string, T> {
		const newRecord: Record<string, T> = {};
		for (const [key, value] of Object.entries(record)) {
			// @ts-ignore
			newRecord[key] = value || 'null';
		}
		return newRecord;
	}

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

<div class="flex h-full flex-col gap-4 px-4">
	<d-feedback {...feedback} />

	{#if !seed}
		<d-vertical-stack>
			<d-heading sixe="s">{m.Answer_to_these_questions()}</d-heading>
			<d-text size="l"
				>{m.to_ensure_the_security_of_your_account_and_simplify_key_recovery_please_answer_the_following_questions_()}</d-text
			>
		</d-vertical-stack>

		<Form
			{form}
			id="questions"
			formClass="flex flex-col  space-y-8 rounded bg-surface w-full pb-6 pt-4"
		>
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
			role="button"
			type="submit"
			form="questions"
			expand
			tabindex={0}
			class="pb-10"
		>
			{m.Next()}
		</d-button>
	{:else}
		<div class="flex h-screen flex-col place-content-between">
			<div class="pt-11">
				<d-vertical-stack>
					<d-heading sixe="s">{m.Store_this_keypair()}</d-heading>
					<d-text size="l">{m.your_unique_keypair_has_been_generated_successfully_()}</d-text>
				</d-vertical-stack>

				<div class="flex w-full flex-col space-y-8 pb-6 pt-4">
					<div class="flex flex-col gap-6">
						<div>
							<d-text>{m.Your_keypair()}</d-text>
							<div class="rounded-lg border border-on bg-highlight p-4 font-mono">
								<div>
									{seed}
								</div>
							</div>
						</div>

						<CopyButton textToCopy={seed}>{m.Copy_seed()}</CopyButton>

						<div class="flex gap-2">
							<d-text size="l" class="text-error"> <ion-icon icon={alertCircleOutline} /></d-text>
							<d-text
								>{m.Please_store_this_in_a_safe_place_to_recover_your_account_in_the_future_this_passphrase_will_be_shown_only_one_time()}</d-text
							>
						</div>
					</div>
				</div>
			</div>
			<div class="flex flex-col gap-3 pb-24">
				<d-text size="m"
					>{m.You_can_recover_your_keypair_by_answering_the_registration_questions_correctly_again()}</d-text
				>
				<d-button color="accent" on:click={goToWallet} on:keydown={goToWallet} aria-hidden expand
					>{m.Go_to_wallet()}</d-button
				>
			</div>
		</div>
	{/if}
</div>
