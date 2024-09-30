<script lang="ts">
	import { version } from '$app/environment';
	import { Form, createForm } from '$lib/forms';
	import { goto, m, r } from '$lib/i18n';
	import Input from '$lib/forms/input.svelte';
	import { arrowForward } from 'ionicons/icons';
	import { z } from 'zod';
	import { checkIfUserExists, login, userEmailStore } from './_lib';
	import background from '$lib/assets/bg-4.svg';
	import { page } from '$app/stores';
	import type { Feedback } from '$lib/utils/types';
	import Checkbox from '$lib/forms/checkbox.svelte';

	//

	const registration = $page.url.searchParams.get('registration') === 'true';

	let feedback: Feedback = {};

	const schema = z.object({
		email: z.string().email(),
		conditions: z
			.literal(true)
			.optional()
			.refine((arg) => (!registration ? true : arg), 'Required'),
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
				feedback: undefined
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

	const { tainted } = form;
</script>

<div class="flex min-h-screen flex-col place-content-between">
	<div class="grow">
		<d-feedback {...feedback} class="sticky top-0 z-50" />
		<d-background-illustration {background}>
			<d-illustration illustration="pidgeon"> </d-illustration></d-background-illustration
		>
		<div>
			<div class="flex flex-col">
				<div class="flex w-full flex-col items-center gap-4 px-8">
					<div class="flex w-full flex-col gap-2 pt-8">
						<d-heading sixe="s">{m.Enter_your_email()}</d-heading>
						<d-text size="l">{m.enter_your_email_to_get_started()}.</d-text>
					</div>

					<Form {form} formClass="flex flex-col gap-4 pb-6 pt-4 w-full" let:isTainted>
						<Input
							{form}
							fieldPath="email"
							placeholder={m.emailexample_com()}
							label={m.Email()}
							type="email"
						/>

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
						{:else}
							<Checkbox fieldPath="conditions" {form}
								>Accept <a
									href="https://didroom.com/guides/7_terms-and-conditions/"
									class="text-accent underline"
								>
									Terms and Conditions
								</a></Checkbox
							>
						{/if}
						<d-button
							size="default"
							color="accent"
							type="submit"
							expand
							class="mt-4"
							disabled={registration
								? !($tainted && $tainted['email'] && $tainted['conditions'])
								: !($tainted && $tainted['email'] && $tainted['password'])}
						>
							{m.Next()}
							<ion-icon icon={arrowForward} slot="end" />
						</d-button>
					</Form>
				</div>
			</div>
		</div>
	</div>
	<d-app-details developedBy={m.Developed_by_Forkbomb_BV()} {version} />
</div>
