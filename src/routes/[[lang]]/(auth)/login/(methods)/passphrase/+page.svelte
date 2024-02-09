<script lang="ts">
	import { regenerateKeypair } from '$lib/keypairoom';
	import { goto, r } from '$lib/i18n';
	import { z } from 'zod';
	import { createForm, FieldController, Form, FormError } from '$lib/forms';
	import { setKeypairPreference } from '$lib/preferences/keypair.js';
	import { unlockApp } from '$lib/preferences/locked.js';

	//

	export let data;
	let { userEmail } = data;

	//

	const passphraseSchema = z.object({
		seed: z
			.string()
			.min(1)
			.refine((v) => v.split(' ').length === 12)
	});

	const form = createForm({
		schema: passphraseSchema,
		onSubmit: async ({ form }) => {
			try {
				const keypair = await regenerateKeypair(userEmail, form.data.seed);
				await setKeypairPreference(keypair);
				await unlockApp();
				await goto('/wallet'); // Note: `goto` needs `await`!
			} catch (e) {
				throw new Error('KEYPAIR_REGENERATION_ERROR');
			}
		}
	});

	//

	const seedPlaceholder = 'skin buyer sunset person run push elevator under debris soft surge man';
</script>

<Form {form}>
	<div class="space-y-6">
		<FieldController {form} fieldPath="seed" let:value let:updateValue>
			<ion-textarea
				placeholder={seedPlaceholder}
				{value}
				on:ionChange={(e) => updateValue(e.target.value)}
			/>
		</FieldController>

		<FormError {form} let:errorMessage>
			<ion-text color="danger">
				{errorMessage}
			</ion-text>
		</FormError>

		<div class="flex justify-end">
			<ion-button role="button" type="submit" tabindex={0}>Login</ion-button>
		</div>

		<hr />

		<div>
			<ion-text color="secondary">
				<a href={r("/login/questions")} class="text-sm">Login with your personal questions? Tap here</a>
			</ion-text>
		</div>
	</div>
</Form>
