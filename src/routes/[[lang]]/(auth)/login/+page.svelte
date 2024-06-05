<script lang="ts">
	import AppDetails from '$lib/components/AppDetails.svelte';
	import Illustration from '$lib/components/molecules/Illustration.svelte';
	import { Form, createForm } from '$lib/forms';
	import { goto, m, r } from '$lib/i18n';
	import Input from '$lib/ionic/forms/input.svelte';
	import { arrowForward } from 'ionicons/icons';
	import { z } from 'zod';
	import { checkIfUserExists, login, userEmailStore } from './_lib';
	import background from '$lib/assets/bg-4.svg';
	import { page } from '$app/stores';
	import type { Feedback } from '$lib/utils/types';

	const registration = $page.url.searchParams.get('registration') === 'true';

	let feedback: Feedback = {};

	const schema = z.object({
		registration: z.boolean(),
		email: z.string().email(),
		password: z
			.string()
			.min(8)
			.max(73)
			.optional()
			.refine((arg) => (registration ? true : arg), 'Required')
	});

	const form = createForm({
		schema,
		onSubmit: async ({ form }) => {
			feedback = {
				type: undefined,
				feedback: ''
			};
			try {
				if (!registration) {
					await login(form.data.email, form.data.password!);
				} else {
					if (await checkIfUserExists(form.data.email))
						throw new Error(m.User_already_exists_try_to_login_or_request_a_new_password());
				}

				userEmailStore.set({
					email: form.data.email,
					registration
				});

				return await goto(registration ? '/login/insert-password' : '/login/passphrase');
			} catch (e) {
				feedback = {
					type: 'error',
					feedback: m.wrong_email_or_password(),
					message: String(e)
				};
			}
		}
	});
</script>

<div class="flex min-h-screen flex-col place-content-between">
	<div class="grow">
		<d-feedback {...feedback} />
		<Illustration img="pidgeon" {background} />
		<div>
			<div class="flex flex-col">
				<div class="flex w-full flex-col items-center gap-4 px-8">
					<div class="flex w-full flex-col gap-2 pt-8">
						<d-heading sixe="s">{m.Enter_your_email()}</d-heading>
						<d-text size="l">{m.enter_your_email_to_get_started()}.</d-text>
					</div>

					<Form {form} formClass="flex flex-col gap-4 pb-6 pt-4 w-full">
						<input
							type="radio"
							checked={registration}
							name="registration"
							value="registration"
							class="hidden"
						/>
						<Input {form} fieldPath="email" placeholder={m.emailexample_com()} label={m.Email()} />
						{#if !registration}
							<Input
								{form}
								fieldPath="password"
								placeholder="password"
								label="password"
								type="password"
								hidable
							>
								<a href={r('/login/reset-password')} class="text-blue-500"
									>{m.forgot_your_password()}</a
								>
							</Input>
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
