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
	import type { Feedback, ScrollableNode } from '$lib/utils/types';
	import Checkbox from '$lib/forms/checkbox.svelte';

	//

	const registration = $page.url.searchParams.get('registration') === 'true';

	let feedback: Feedback = {};
	let content: ScrollableNode;

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
				content.scrollToTop();
			}
		}
	});

	const { fields } = form;
	const email = fields.email.value;
	const password = fields.password.value;
	const conditions = fields.conditions.value;
	const isFalsy = (value: string | boolean | undefined): boolean =>
		value === '' || value === undefined || value === false;
	$: disabled = registration
		? isFalsy($email) || isFalsy($conditions)
		: isFalsy($email) || isFalsy($password);
</script>

<ion-content class="flex min-h-screen flex-col place-content-between" bind:this={content}>
	<div class="grow">
		<d-feedback {...feedback} />
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

					<Form {form} formClass="flex flex-col gap-2 pb-6 pt-4 w-full" let:isTainted>
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
								<a href={r('/login/reset-password')} class="h-12 text-accent underline"
									>{m.forgot_your_password()}</a
								>
							</Input>
						{:else}
							<Checkbox fieldPath="conditions" {form}
								><d-text size="l" class="flex items-center gap-1">
										{m.Accept()}
									<a
										href="https://didroom.com/guides/Terms-and-conditions/"
										class="flex h-12 items-center text-accent underline"
									>
										{m.Terms_and_Conditions()}
									</a>
								</d-text>
							</Checkbox>
						{/if}
						<d-vertical-stack gap="4" class="mt-4">
							<d-button size="default" color="accent" type="submit" expand {disabled}>
								{m.Next()}
								<ion-icon icon={arrowForward} slot="end" aria-label="next" />
							</d-button>
							<d-button
								size="default"
								color="outline"
								expand
								on:click={() => goto('/register-login')}
								aria-hidden
							>
								{'back'}
							</d-button>
						</d-vertical-stack>
					</Form>
				</div>
			</div>
		</div>
	</div>
	<d-app-details developedBy={m.Developed_by_Forkbomb_BV()} {version} />
</ion-content>
