<script lang="ts">
	// @ts-ignore
	import IonPage from 'ionic-svelte/components/IonPage.svelte';
	import Header from '$lib/components/molecules/Header.svelte';
	import { z } from 'zod';
	import { Form, createForm } from '$lib/components/organisms/forms';
	import Input from '$lib/components/organisms/forms/input.svelte';
	import { goto } from '$lib/i18n';
	import { userEmailStore } from '../../_lib';
	import { m } from '$lib/i18n';
	import { arrowForward } from 'ionicons/icons';
	import Illustration from '$lib/components/molecules/Illustration.svelte';
	import illustrations2 from '$lib/assets/Illustrations2.png';
	import vector from '$lib/assets/Vector.png';

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

<Header>{m.REGISTER()}</Header>

<ion-content fullscreen>
	<div class="flex flex-col">
		<Illustration img="chat" />
		<div class="flex w-full flex-col items-center gap-6 px-8">
			<d-heading sixe="s">{m.Confirm_your_email()}</d-heading>
			<d-text size="l">{m.Reenter_your_email_address_to_confirm_registration_()}</d-text>

			<Form {form} formClass="flex flex-col gap-4 pb-6 pt-4 w-full">
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
