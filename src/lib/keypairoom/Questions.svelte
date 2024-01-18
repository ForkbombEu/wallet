<script lang="ts">
	import TextInput from '$lib/forms/textInput.svelte';
	import { superForm, superValidateSync } from 'sveltekit-superforms/client';
	import { generateKeypair } from '$lib/keypairoom';
	import { userAnswersSchema, userQuestions } from '$lib/keypairoom/userQuestions';
	import { setPreference } from '$lib/preferences/prefereces';
	import { goto } from '$app/navigation';

	const schemaValidated = superValidateSync({}, userAnswersSchema, { errors: false });

	const { form, errors } = superForm(schemaValidated, {
		SPA: true,
		validators: userAnswersSchema,

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
		for (let [key, value] of Object.entries($form)) {
			//@ts-ignore
			if (!value) $form[key] = 'null';
		}

		//@ts-ignore
		const keypair = await generateKeypair($form);
		try {
			setPreference('keyring', JSON.stringify(keypair), true);
			goto('/wallet');
		} catch (e) {
			goto('/auth');
		}
	};
</script>

<form on:submit={submit}>
	<ion-list lines="full" class="ion-no-margin ion-no-padding">
		<TextInput type="email" label="email" name="email" {form} {errors} />
		{#each userQuestions as question}
			<TextInput name={question.id} label={question.text} {form} {errors} />
		{/each}
	</ion-list>
	{#if $errors._errors?.length}
		<ion-item>
			<ion-text color="danger">
				{$errors._errors[0]}
			</ion-text>
		</ion-item>
	{/if}
	<ion-button role="button" type="submit" tabindex={0}>login</ion-button>
	<ion-item>
		<ion-text color="secondary"><a href="/seeds">Do you want to login with your mnemonic? Tap here</a></ion-text>
	</ion-item>
</form>
