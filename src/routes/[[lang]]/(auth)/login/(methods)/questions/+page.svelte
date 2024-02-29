<script lang="ts">
	import { generateKeypair, type UserChallengesAnswers } from '$lib/keypairoom';
	import { Form, createForm } from '$lib/forms';
	import { Input } from '$lib/ionic/forms';
	import FormError from '$lib/forms/formError.svelte';

	import { z } from 'zod';
	import { UserChallenges as C, type UserChallenge } from '$lib/keypairoom';
	import CopyButton from '$lib/components/copyButton.svelte';
	import { setKeypairPreference } from '$lib/preferences/keypair.js';
	import { unlockApp } from '$lib/preferences/locked.js';
	import { r, m } from '$lib/i18n';
	import { generateDid, generateSignroomUser } from '../../_lib';

	//

	export let data;
	let { userEmail } = data;

	//

	let seed: string | undefined = undefined;

	//

	export const questions: Array<{ id: UserChallenge; text: string }> = [
		{ id: C.whereParentsMet, text: m.Where_did_your_parents_meet() },
		{ id: C.nameFirstPet, text: m.What_is_the_name_of_your_first_pet() },
		{ id: C.whereHomeTown, text: m.What_is_your_home_town() },
		{ id: C.nameFirstTeacher, text: m.What_is_the_name_of_your_first_teacher() },
		{ id: C.nameMotherMaid, text: m.What_is_the_surname_of_your_mother_before_wedding() }
	];

	//

	export const answersSchemaError = 'AT_LEAST_THREE_QUESTIONS';

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
				const formattedAnswers = convertUndefinedToNullString(form.data);
				const keypair = await generateKeypair(userEmail, formattedAnswers as UserChallengesAnswers);

				await setKeypairPreference(keypair);
				await generateSignroomUser(userEmail);
				await generateDid();

				await unlockApp();
				seed = keypair.seed;

				/**
				 * Note
				 *
				 * It seems that setting a preference reloads the app
				 * it re-runs all the load functions
				 *
				 * This means that once the keyring preference is set
				 * login/+layout  in throws the user inside /wallet
				 *
				 * For this reason, that layout is temp commented
				 */
			} catch (e) {
				throw new Error('KEYPAIR_GENERATION_ERROR');
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
</script>

{#if !seed}
	<Form {form}>
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

			<div class="flex justify-end">
				<d-button color="accent" role="button" type="submit" tabindex={0}>{m.Login()}</d-button>
			</div>

			<hr />

			<div>
				<ion-text color="secondary">
					<a href={r('/login/passphrase')} class="text-sm"
						>{m.Login_with_your_passphrase_Tap_here()}</a
					>
				</ion-text>
			</div>
		</div>
	</Form>
{:else}
	<div class="space-y-6">
		<h1 class="text-lg font-bold">{m.Keypair_creation_successful()}</h1>

		<div>
			<ion-text>
				{m.Please_store_this_in_a_safe_place_to_recover_your_account_in_the_future_this_passphrase_will_be_shown_only_one_time()}
			</ion-text>
		</div>

		<div class="rounded-lg border border-white p-4 font-mono">
			<div>
				{seed}
			</div>
			<div class="flex justify-end pt-4">
				<CopyButton textToCopy={seed}>{m.Copy_seed()}</CopyButton>
			</div>
		</div>

		<d-button color="accent" href={r('/wallet')} expand>{m.Go_to_wallet()}</d-button>
	</div>
{/if}
