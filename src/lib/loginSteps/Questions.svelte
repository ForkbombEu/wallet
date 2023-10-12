<script lang="ts">
	import TextInput from '$lib/forms/textInput.svelte';
	import { superForm, superValidateSync } from 'sveltekit-superforms/client';
	import {  generateKeypair } from '$lib/keypairoom/keypair';
	import { userAnswersSchema, userQuestions } from '$lib/keypairoom/userQuestions';
	import { setPreference } from '$lib/preferences/prefereces';
	import { goto } from '$app/navigation';

	
	const schemaValidated = superValidateSync({}, userAnswersSchema, { errors: false });

	const { form, errors, message, constraints, delayed, validate } = superForm(schemaValidated, {
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
		const keypair = await generateKeypair($form.email!, $form);
        setPreference("keyring", JSON.stringify(keypair))
        goto("/r/wallet")
	};
	async function checkInput(e: any) {
		if (e.target.name in $form) {
			//@ts-ignore
			$form[e.target.name] = e.detail.value;
		}
	}
</script>

<form on:submit={submit}>
	<ion-list lines="full" class="ion-no-margin ion-no-padding">
            <TextInput type="email" label="email" name="email" {form} {errors} {checkInput} />
		{#each userQuestions as question}
			<TextInput name={question.id} label={question.text} {form} {errors} {checkInput} />
		{/each}
	</ion-list>
	{#if $errors._errors?.length}
		<ion-text color="danger">
			{$errors._errors[0]}
		</ion-text>
	{/if}
	<ion-button role="button" type="submit" tabindex={0}>login</ion-button>
</form>
