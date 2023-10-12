<script lang="ts">
	import TextInput from '$lib/forms/textInput.svelte';
	import { z } from 'zod';
	import { superForm, superValidateSync } from 'sveltekit-superforms/client';
	import { zencode_exec } from 'zenroom';
	import keypairoomClient from '../../../zenflows-crypto/src/keypairoomClient-8-9-10-11-12.zen?raw';
	import { generateHMAC, generateKeypair } from '$lib/keypairoom/keypair';
	import { userAnswersSchema, userQuestions, userQuestionsKeys } from '$lib/keypairoom/userQuestions';

	interface Keyring {
		eddsa: string;
		ethereum: string;
		reflow: string;
		bitcoin: string;
		ecdh: string;
	}
	interface Keypair {
		seed: string;
		keyring: Keyring;
		ecdh_public_key: string;
		bitcoin_public_key: string;
		eddsa_public_key: string;
		reflow_public_key: string;
		ethereum_address: string;
	}
	async function zencodeExec<T>(contract: string, data: Record<string, unknown>): Promise<T> {
		const { result } = await zencode_exec(contract, { data: JSON.stringify(data) });
		return JSON.parse(result);
	}

	// async function generateKeypair(email: string, answers: Login): Promise<Keypair> {
	//     const HMAC = generateHMAC(email)
	// 	const pp: Keypair = await zencodeExec(keypairoomClient, {
	// 		userChallenges: {
	// 			whereParentsMet: answers['Where my parents met?'],
	// 			nameFirstPet: answers['What is the name of your first pet?'],
	// 			nameFirstTeacher: answers['What is the name of your first teacher?'],
	// 			whereHomeTown: answers['What is your home town?'],
	// 			nameMotherMaid: answers['What is the surname of your mother before wedding?']
	// 		},
	// 		username: email,
	// 		'seedServerSideShard.HMAC': HMAC
	// 	});
	// 	console.log(pp);
	// 	return pp;
	// }

	// const questionsSchema = z
	// 	.object({
	// 		'Where my parents met?': z.string().min(2),
	// 		'What is the name of your first pet?': z.string().min(2),
	// 		'What is your home town?': z.string().min(2),
	// 		'What is the name of your first teacher?': z.string().min(2),
	// 		'What is the surname of your mother before wedding?': z.string().min(2)
	// 	})
	// 	.partial()
	// 	.refine(
	// 		(f) => {
	// 			console.log(
	// 				f,
	// 				Object.values(f).filter((f) => f !== undefined)
	// 			);
	// 			return Object.values(f).filter((f) => f !== undefined).length > 2;
	// 		},
	// 		{ message: 'At least 3 fields must be defined' }
	// 	);

	// type Login = z.infer<typeof questionsSchema>;
	const schema = z.object({
		email: z.string().email(),
		questions: userAnswersSchema
	});
	const schemaValidated = superValidateSync({}, userAnswersSchema, { errors: false });

	const { form, errors, message, constraints, enhance, delayed, validate } = superForm(schemaValidated, {
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
		const keypair = await generateKeypair('pippo@gmail.com', $form);
        console.log(keypair)
	};
	async function checkInput(e: any) {
		console.log('Getting stuff', e.detail.value, e.target.name);
		if (e.target.name in $form) {
			//@ts-ignore
			$form[e.target.name] = e.detail.value;
		}
		console.log($form);
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
	<ion-button role="button" type="submit" tabindex={0}>pp</ion-button>
</form>
