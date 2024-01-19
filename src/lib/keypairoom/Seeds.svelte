<script lang="ts">
	import TextInput from '$lib/ionic/forms/input.svelte';
	import { superForm, superValidateSync } from 'sveltekit-superforms/client';
	import { regenerateKeypair } from '$lib/keypairoom';
	import { setPreference } from '$lib/preferences';
	import { goto } from '$app/navigation';
	import { z } from 'zod';
	import { createForm, Form, FormError } from '$lib/forms';

	const seedAnswersSchema = z.object({
		email: z.string().min(1).email(),
		seed: z
			.string()
			.min(1)
			.refine((v) => v.split(' ').length === 12)
	});

	const form = createForm({
		schema: seedAnswersSchema,
		onSubmit: async () => {
			// 	const keypair = await regenerateKeypair($form.email!, $form.seed!);
			// setPreference('keyring', JSON.stringify(keypair));
			// goto('/wallet');
		}
	});
</script>

<Form {form}>
	<ion-list lines="full" class="ion-no-margin ion-no-padding">
		<!-- <TextInput type="email" label="email" name="email" {form} {errors} /> -->
		<!-- <TextInput label="seed" name="seed" {form} {errors} /> -->
	</ion-list>

	<FormError {form} let:errorMessage>
		<ion-text color="danger">
			{errorMessage}
		</ion-text>
	</FormError>

	<ion-button role="button" type="submit" tabindex={0}>login</ion-button>

	<ion-item>
		<ion-text color="secondary">
			<a href="/login">Do you want to login answering your personal question? tap here</a>
		</ion-text>
	</ion-item>
</Form>
