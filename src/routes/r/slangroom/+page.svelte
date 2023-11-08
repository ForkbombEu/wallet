<script lang="ts">
	import TextInput from '$lib/forms/textInput.svelte';
	import * as slangroom from '$lib/slangroom';
	import { superForm, superValidateSync } from 'sveltekit-superforms/client';
	import { z } from 'zod';

	let slangroomPromise: Promise<Record<Key, any>> | undefined;
	let userId: string | undefined;
	let token: string | undefined;

	const keysToExclude = ['authWithPassword', 'updateProfile', 'organizationServices'] as const;
	type KeysToExclude = (typeof keysToExclude)[number];
	const slangroomKeys = Object.keys(slangroom).filter(
		(key) => !keysToExclude.includes(key as KeysToExclude)
	) as unknown as Exclude<keyof typeof slangroom, (typeof keysToExclude)[number]>[];
	type Key = (typeof slangroomKeys)[number];

	const getSlangroomResult = async () => {
		const res: Record<Key, any> = {} as Record<Key, any>;
		if (userId && token) {
			for (const key of slangroomKeys) {
				res[key] = await slangroom[key as Key]({ id: userId!, token: token! });
			}
		}
		return res;
	};

	//

	const loginSchema = z.object({
		email: z.string().min(1).email(),
		password: z.string().min(1)
	});

	const schemaValidated = superValidateSync({}, loginSchema, { errors: false });

	const { form, errors } = superForm(schemaValidated, {
		SPA: true,
		validators: loginSchema,

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
		const res = await slangroom.authWithPassword($form.email, $form.password);
		userId = res.result.record.id;
		token = res.result.token;
		slangroomPromise = getSlangroomResult();
	};
</script>

<ion-tab tab="slangroom">
	<ion-header translucent={true}>
		<ion-toolbar>
			<ion-buttons slot="start">
				<ion-menu-button />
			</ion-buttons>
			<ion-title>Slangroom</ion-title>
		</ion-toolbar>
	</ion-header>

	<ion-content fullscreen class="ion-padding">
		<h1 class="mb-10 text-3xl font-bold">Test Slangroom calls</h1>
		<form on:submit={submit}>
			<ion-list lines="full" class="ion-no-margin ion-no-padding">
				<TextInput type="email" label="email" name="email" {form} {errors} />
				<TextInput type="password" label="password" name="password" {form} {errors} />
			</ion-list>

			{#if $errors._errors?.length}
				<ion-text color="danger">
					{$errors._errors[0]}
				</ion-text>
			{/if}
			<ion-button role="button" type="submit" tabindex={0}>login</ion-button>
		</form>
		<ion-item-divider />
		{#if slangroomPromise}
			{#await slangroomPromise}
				if
			{:then slangroomResponse}
				<ion-accordion-group>
					{#each slangroomKeys as k}
						<ion-accordion value={k}>
							<ion-item slot="header" color="light">
								<ion-label>{k}</ion-label>
							</ion-item>
							<div class="ion-padding" slot="content">
								<pre>
                                {JSON.stringify(slangroomResponse?.[k], null, 2)}
                            </pre>
							</div>
						</ion-accordion>
					{/each}
				</ion-accordion-group>
			{:catch}
				error
			{/await}
		{:else}
			login to see some action
		{/if}
	</ion-content>
</ion-tab>
