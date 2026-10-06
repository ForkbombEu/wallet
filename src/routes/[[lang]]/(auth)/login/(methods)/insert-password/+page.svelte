<script lang="ts">
	import WalletFeedback from '$lib/components/molecules/Feedback.svelte';
	import { Form, createForm } from '$lib/forms';
	import { goto, m } from '$lib/i18n';
	import { Input } from '$lib/forms';
	import { arrowForward } from 'ionicons/icons';
	import { z } from 'zod';
	import { createUser, login, userEmailStore } from '../../_lib';
	import background from '$lib/assets/bg-5.svg';
	import type { Feedback } from '$lib/utils/types';

	let feedback: Feedback = {};

	const schema = z.object({
		password: z.string().min(8).max(73),
		confirmPassword: z.string().min(8).max(73)
	});

	const form = createForm({
		schema,
		onSubmit: async ({ form }) => {
			try {
				const { password, confirmPassword } = form.data;
				if (confirmPassword !== password) throw new Error(`The passwords do not match`);
				await createUser($userEmailStore.email!, password, confirmPassword);
				await login($userEmailStore.email!, password);
				userEmailStore.set({
					email: $userEmailStore.email!,
					registration: $userEmailStore.registration,
					password
				});
				await goto('/login/questions');
			} catch (e) {
				feedback = {
					type: 'error',
					feedback: String(e)
				};
			}
		}
	});
</script>

<d-header
	back-button
	on:backButtonClick={() => window.history.back()}
	settings-title={m.Settings()}
	back-button-label={m.back()}
>
	{m.REGISTER()}
</d-header>
<WalletFeedback {...feedback} />

<div class="flex flex-col">
	<div>
		<d-background-illustration {background} compact aria-hidden="true">
			<d-illustration illustration="chat" /></d-background-illustration
		>
	</div>
	<div>
		<div class="auth-task">
			<d-heading size="s" level={1}>{m.Choose_your_password()}</d-heading>
			<p class="text-on-alt">{m.Authentication_step({ current: 2, total: 3 })}</p>
			<d-text size="l">{m.Your_password_should_be_between_8_and_73_character()}</d-text>

			<Form {form} formClass="flex flex-col gap-4 pb-6 pt-4 w-full" let:isTainted>
				<Input
					{form}
					fieldPath="password"
					label={m.Password()}
					autocomplete="new-password"
					type="password"
					hidable
				/>
				<Input
					{form}
					fieldPath="confirmPassword"
					label={m.Confirm_password()}
					autocomplete="new-password"
					type="password"
					hidable
				/>

				<d-button
					size="default"
					color="accent"
					type="submit"
					expand
					class="mt-4"
					disabled={!isTainted}
				>
					{m.Next()}
					<ion-icon icon={arrowForward} slot="end" aria-hidden="true" />
				</d-button>
			</Form>
		</div>
	</div>
</div>
