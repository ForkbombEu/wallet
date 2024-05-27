<script lang="ts">
	import Header from '$lib/components/molecules/Header.svelte';
	import Illustration from '$lib/components/molecules/Illustration.svelte';
	import { Form, createForm } from '$lib/forms';
	import { goto, m } from '$lib/i18n';
	import { Input } from '$lib/ionic/forms';
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

<Header>{m.REGISTER()}</Header>
<d-feedback {...feedback} />

<div class="flex flex-col">
	<div class="mb-10 sm:mb-0">
		<Illustration img="chat" {background} />
	</div>
	<div>
		<div class="flex w-full flex-col items-center gap-6 px-8">
			<d-heading sixe="s">Choose your password</d-heading>
			<d-text size="l">Your password should be between 8 and 73 character</d-text>

			<Form {form} formClass="flex flex-col gap-4 pb-6 pt-4 w-full">
				<Input
					{form}
					fieldPath="password"
					placeholder="password"
					label="password"
					type="password"
					hidable
				/>
				<Input
					{form}
					fieldPath="confirmPassword"
					placeholder="password"
					label="confirm your password"
					type="password"
					hidable
				/>

				<d-button size="default" color="accent" type="submit" expand class="mt-4">
					{m.Next()}
					<ion-icon icon={arrowForward} slot="end" />
				</d-button>
			</Form>
		</div>
	</div>
</div>
