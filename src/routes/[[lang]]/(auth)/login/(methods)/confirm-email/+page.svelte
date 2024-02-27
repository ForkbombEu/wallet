<script lang="ts">
	// @ts-ignore
	import IonPage from 'ionic-svelte/components/IonPage.svelte';
	import Header from '$lib/components/molecules/Header.svelte';
	import { z } from 'zod';
	import { Form, createForm } from '$lib/forms';
	import Input from '$lib/ionic/forms/input.svelte';
	import { goto } from '$lib/i18n';
	import { userEmailStore } from '../../_lib';
	import { m } from '$lib/i18n';
	import { arrowForward } from 'ionicons/icons';

	const schema = z.object({
		email: z.literal($userEmailStore),
		rememberEmail: z.boolean().optional()
	});

	const form = createForm({
		schema,
		onSubmit: async ({ form }) => {
			userEmailStore.set(form.data.email);
			await goto('/login/questions');
		}
	});
</script>

	<Header>REGISTER</Header>

	<ion-content fullscreen class="h-full">
		<div class="flex flex-col">
			<img src="https://placehold.co/600x400/png" alt="placeholder" />
			<div class="flex w-full flex-col items-center gap-6 px-8">
				<div class="flex w-full flex-col gap-2 bg-primary py-8">
					<d-heading sixe="s">Confirm your email</d-heading>
					<d-text size="l">Re-enter your email address to confirm registration.</d-text>
				</div>

				<Form {form} formClass="flex flex-col  gap-8 rounded bg-surface px-4 pb-6 pt-4 w-full">
					<d-text size="s" class="opacity-30">{m.Email()}</d-text>
					<Input
						{form}
						fieldPath="email"
						placeholder={m.emailexample_com()}
						label={m.type_your_email()}
					/>
					<d-button size="default" color="accent" type="submit" expand class="mt-4">
						{m.Next()}
						<ion-icon icon={arrowForward} slot="end" />
					</d-button>
				</Form>
			</div>
		</div></ion-content
	>
