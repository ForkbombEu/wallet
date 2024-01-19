<script lang="ts">
	import TextInput from '$lib/ionic/forms/input.svelte';
	import { regenerateKeypair } from '$lib/keypairoom';
	import { goto } from '$app/navigation';
	import { z } from 'zod';
	import { createForm, Form, FormError } from '$lib/forms';
	import { setKeypairPreference } from '$lib/preferences/keypair.js';

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
			const keypair = await regenerateKeypair(userEmail, form.data.seed);
			await setKeypairPreference(keypair);
			goto('/wallet');
		}
	});
</script>

<Form {form}>
	<div class="space-y-6">
		<ion-list lines="full" class="ion-no-margin ion-no-padding">
			<!-- <TextInput type="email" label="email" name="email" {form} {errors} /> -->
			<!-- <TextInput label="seed" name="seed" {form} {errors} /> -->
		</ion-list>

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
				<a href="/login/questions" class="text-sm">Login with your personal questions? Tap here</a>
			</ion-text>
		</div>
	</div>
</Form>
