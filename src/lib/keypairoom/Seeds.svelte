<script lang="ts">
	import TextInput from '$lib/forms/textInput.svelte';
	import { superForm, superValidateSync } from 'sveltekit-superforms/client';
	import { regenerateKeypair } from '$lib/keypairoom';
	import { setPreference } from '$lib/preferences';
	import { goto } from '$app/navigation';
	import { z } from 'zod';

	const seedAnswersSchema = z.object({
		email: z.string().min(1).email(),
		seed: z
			.string()
			.min(1)
			.refine((v) => v.split(' ').length === 12)
	});

	const schemaValidated = superValidateSync({}, seedAnswersSchema, { errors: false });

	const { form, errors } = superForm(schemaValidated, {
		SPA: true,
		validators: seedAnswersSchema,

		onError({ result, message }) {
			console.log('ERROR received', result, message);
			message.set(result.error.message);
		},
		onUpdate(form) {
			console.log('SUBMIT clicked, received form', form);
		},
		validationMethod: 'oninput'
	});
	const submit = async () => {
		const keypair = await regenerateKeypair($form.email!, $form.seed!);
		setPreference('keyring', JSON.stringify(keypair));
		goto('/wallet');
	};
</script>

<form on:submit={submit}>
	<ion-list lines="full" class="ion-no-margin ion-no-padding">
		<TextInput type="email" label="email" name="email" {form} {errors} />
		<TextInput label="seed" name="seed" {form} {errors} />
	</ion-list>

	{#if $errors._errors?.length}
		<ion-text color="danger">
			{$errors._errors[0]}
		</ion-text>
	{/if}
	<ion-button role="button" type="submit" tabindex={0}>login</ion-button>
	<ion-item>
		<ion-text color="secondary"
			><a href="/login">Do you want to login answering your personal question? tap here</a></ion-text
		>
	</ion-item>
</form>
