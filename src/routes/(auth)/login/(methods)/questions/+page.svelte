<script lang="ts">
	import { generateKeypair, type UserChallengesAnswers } from '$lib/keypairoom';
	import { Form, createForm } from '$lib/forms';
	import { Input } from '$lib/ionic/forms';
	import FormError from '$lib/forms/formError.svelte';

	import { z } from 'zod';
	import { UserChallenges as C, type UserChallenge } from '$lib/keypairoom';
	import CopyButton from '$lib/components/copyButton.svelte';
	import { setKeypairPreference } from '$lib/preferences/keypair.js';

	//

	export let data;
	let { userEmail } = data;

	//

	let seed: string | undefined = undefined;

	//

	export const questions: Array<{ id: UserChallenge; text: string }> = [
		{ id: C.whereParentsMet, text: 'Where did your parents meet?' },
		{ id: C.nameFirstPet, text: 'What is the name of your first pet?' },
		{ id: C.whereHomeTown, text: 'What is your home town?' },
		{ id: C.nameFirstTeacher, text: 'What is the name of your first teacher?' },
		{ id: C.nameMotherMaid, text: 'What is the surname of your mother before wedding?' }
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
	function convertUndefinedToNullString<T>(record: Record<string, T | undefined>): Record<string, T> {
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
				<ion-button role="button" type="submit" tabindex={0}>login</ion-button>
			</div>

			<hr />

			<div>
				<ion-text color="secondary">
					<a href="/login/passphrase" class="text-sm">Login with your passphrase? Tap here</a>
				</ion-text>
			</div>
		</div>
	</Form>
{:else}
	<div class="space-y-6">
		<h1 class="text-lg font-bold">Keypair creation successful!</h1>

		<div>
			<ion-text>
				Please store this in a safe place to recover your account in the future, this passphrase will be shown only one
				time!
			</ion-text>
		</div>

		<div class="rounded-lg border border-white p-4 font-mono">
			<div>
				{seed}
			</div>
			<div class="flex justify-end pt-4">
				<CopyButton textToCopy={seed}>Copy seed</CopyButton>
			</div>
		</div>

		<ion-button href="/wallet" expand="full">Go to wallet</ion-button>
	</div>
{/if}
