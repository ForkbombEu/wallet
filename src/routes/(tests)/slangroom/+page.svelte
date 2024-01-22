<script lang="ts">
	import { Form, FormError, createForm } from '$lib/forms';
	import { Input } from '$lib/ionic/forms';
	import * as slangroom from '$lib/slangroom';
	import { z } from 'zod';

	//

	let slangroomPromise: Promise<Record<SlangroomKeys, any>> | undefined;
	let userId: string | undefined;
	let token: string | undefined;
	let loginError: string | undefined;

	const keysToExclude = ['authWithPassword', 'updateProfile', 'organizationServices'] as const;
	type KeysToExclude = (typeof keysToExclude)[number];
	type SlangroomKeys = Exclude<keyof typeof slangroom, KeysToExclude>;

	const slangroomKeys = Object.keys(slangroom).filter(
		(key) => !keysToExclude.includes(key as KeysToExclude)
	) as SlangroomKeys[];

	const getSlangroomResult = async () => {
		const res: Record<SlangroomKeys, any> = {} as Record<SlangroomKeys, any>;
		if (!(userId && token)) throw new Error('userId or token missing');
		for (const key of slangroomKeys) {
			res[key] = await slangroom[key]({ id: userId!, token: token! });
		}
		if (!slangroomKeys.some((key) => res[key] !== undefined)) throw new Error();
		return res;
	};

	//

	const loginSchema = z.object({
		email: z.string().min(1).email(),
		password: z.string().min(1)
	});

	const form = createForm({
		schema: loginSchema,
		onSubmit: async ({ form }) => {
			loginError = undefined;
			const res = await slangroom.authWithPassword(form.data.email, form.data.password);
			if (res.status !== 200) {
				loginError = `login failed: ${res.status} error`;
				slangroomPromise = undefined;
				return;
			}
			userId = res.result.record.id;
			token = res.result.token;
			slangroomPromise = getSlangroomResult();
		}
	});
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

		<Form {form}>
			<ion-list lines="full" class="ion-no-margin ion-no-padding">
				<Input {form} fieldPath="email" type="email" />
				<Input {form} fieldPath="password" type="password" />
			</ion-list>

			<ion-button role="button" type="submit" tabindex={0}>login</ion-button>

			<FormError {form} let:errorMessage>
				<ion-text color="danger">
					{errorMessage}
				</ion-text>
			</FormError>

			{#if loginError}
				<ion-text color="danger">
					{loginError}
				</ion-text>
			{/if}
		</Form>

		<ion-item-divider />
		{#if slangroomPromise}
			{#await slangroomPromise}
				waiting
			{:then slangroomResponse}
				<ion-accordion-group>
					{#each slangroomKeys as k}
						<ion-accordion value={k}>
							<ion-item slot="header" color="light">
								<ion-label>{k}</ion-label>
							</ion-item>
							<div class="ion-padding" slot="content">
								<pre>{JSON.stringify(slangroomResponse?.[k], null, 2)}</pre>
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
