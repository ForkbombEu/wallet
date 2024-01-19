<script lang="ts">
	import { generateKeypair } from '$lib/keypairoom';
	import { answersSchema, questions } from '$lib/keypairoomForms';
	import { setPreference } from '$lib/preferences';
	import { goto } from '$app/navigation';
	import { Form, createForm } from '$lib/forms';
	import { Input } from '$lib/ionic/forms';
	import FormError from '$lib/forms/formError.svelte';

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
	<div>
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

	<ion-button role="button" type="submit" tabindex={0}>login</ion-button>

	<ion-item>
		<ion-text color="secondary"><a href="/seeds">Do you want to login with your mnemonic? Tap here</a></ion-text>
	</ion-item>
</Form>
