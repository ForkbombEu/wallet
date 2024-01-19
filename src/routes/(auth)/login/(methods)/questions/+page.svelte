<script lang="ts">
	import { generateKeypair, type UserChallengesAnswers } from '$lib/keypairoom';
	import { setPreference } from '$lib/preferences';
	import { goto } from '$app/navigation';
	import { Form, createForm } from '$lib/forms';
	import { Input } from '$lib/ionic/forms';
	import FormError from '$lib/forms/formError.svelte';

	import { z } from 'zod';
	import { UserChallenges as C, type UserChallenge } from '$lib/keypairoom';
	import TEE from '$lib/nativeHooks/TEEPlugin';
	import { KEYRING_PREFERENCES_KEY } from '$lib/utils/constants';

	//

	export let data;
	let { userEmail } = data;

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
				await TEE.generateKey();
				await setPreference(KEYRING_PREFERENCES_KEY, JSON.stringify(keypair), true);
				goto('/wallet');
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
