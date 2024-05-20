<script lang="ts">
	import AppDetails from '$lib/components/AppDetails.svelte';
	import Illustration from '$lib/components/molecules/Illustration.svelte';
	import { Form, createForm } from '$lib/forms';
	import { goto, m } from '$lib/i18n';
	import Input from '$lib/ionic/forms/input.svelte';
	import { arrowForward } from 'ionicons/icons';
	import { z } from 'zod';
	import { userEmailStore } from './_lib';
	import background from '$lib/assets/bg-4.svg';

	//

	import { page } from '$app/stores';
	const registration = $page.url.searchParams.get('registration') === 'true';
	console.table($page.url);

	const schema = z.object({
		email: z.string().email(),
		password: z.string().min(8).max(73).optional()
		// rememberEmail: z.boolean().optional()
	});

	const form = createForm({
		schema,
		onSubmit: async ({ form }) => {
			userEmailStore.set({
				email: form.data.email,
				registration,
				password: form.data.password,
				passwordConfirm: undefined
			});
			await goto(registration ? '/login/insert-password' : '/login/passphrase');
		}
	});
</script>

<div class="flex min-h-screen flex-col place-content-between">
	<div class="grow">
		<Illustration img="pidgeon" {background} />
		<div>
			<div class="flex flex-col">
				<div class="flex w-full flex-col items-center gap-4 px-8">
					<div class="flex w-full flex-col gap-2 pt-8">
						<d-heading sixe="s">{m.Enter_your_email()}</d-heading>
						<d-text size="l">{m.enter_your_email_to_get_started()}.</d-text>
					</div>

					<Form {form} formClass="flex flex-col gap-4 pb-6 pt-4 w-full">
						<Input {form} fieldPath="email" placeholder={m.emailexample_com()} label={m.Email()} />
						{#if !registration}
							<Input
								{form}
								fieldPath="password"
								placeholder="password"
								label="password"
								type="password"
							/>
						{/if}
						<d-button size="default" color="accent" type="submit" expand class="mt-4">
							{m.Next()}
							<ion-icon icon={arrowForward} slot="end" />
						</d-button>
					</Form>
				</div>
			</div>
		</div>
	</div>
	<AppDetails />
</div>
