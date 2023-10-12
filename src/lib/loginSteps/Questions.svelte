<script lang="ts">
	import TextInput from '$lib/forms/textInput.svelte';
	import { superForm, superValidateSync } from 'sveltekit-superforms/client';
	import { generateKeypair } from '$lib/keypairoom/keypair';
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
		setPreference('keyring', JSON.stringify(keypair));
		goto('/r/wallet');
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
		<ion-text color="danger">
			{$errors._errors[0]}
		</ion-text>
	{/if}
	<ion-button role="button" type="submit" tabindex={0}>login</ion-button>
</form>
