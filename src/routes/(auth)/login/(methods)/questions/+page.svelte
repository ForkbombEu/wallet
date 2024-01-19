<script lang="ts">
	import { generateKeypair } from '$lib/keypairoom';
	import { setPreference } from '$lib/preferences';
	import { goto } from '$app/navigation';
	import { Form, createForm } from '$lib/forms';
	import { Input } from '$lib/ionic/forms';
	import FormError from '$lib/forms/formError.svelte';

	import { z } from 'zod';
	import { UserChallenges as C, type UserChallenge } from '$lib/keypairoom';

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
			let data = form.data;
			for (let [key, value] of Object.entries(data)) {
				//@ts-ignore
				if (!value) data[key] = 'null';
			}
			// const keypair = await generateKeypair(data);
			try {
				// setPreference('keyring', JSON.stringify(keypair), true);
				goto('/wallet');
			} catch (e) {
				goto('/register');
			}
		}
	});
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
