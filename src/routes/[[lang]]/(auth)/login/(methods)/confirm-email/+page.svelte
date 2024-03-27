<script lang="ts">
	import Header from '$lib/components/molecules/Header.svelte';
	import Illustration from '$lib/components/molecules/Illustration.svelte';
	import { Form, createForm } from '$lib/forms';
	import { goto, m } from '$lib/i18n';
	import { Input } from '$lib/ionic/forms';
	import { arrowForward } from 'ionicons/icons';
	import { z } from 'zod';
	import { userEmailStore } from '../../_lib';
	import background from '$lib/assets/bg-5.svg';


	const schema = z.object({
		email: z.literal($userEmailStore.email),
		rememberEmail: z.boolean().optional()
	});

	const form = createForm({
		schema,
		onSubmit: async ({ form }) => {
			userEmailStore.set({ email: form.data.email, registration: false });
			await goto('/login/questions');
		}
	});
</script>

<Header>{m.REGISTER()}</Header>

<div class="flex flex-col">
	<div class="relative min-h-[40vh]">
		<img
			src={background}
			class="w-full shrink-0 fill-[var(--highlight)] opacity-50"
			alt="background"
		/>
		<Illustration img="chat" />
	</div>
	<div>
		<div class="flex w-full flex-col items-center gap-6 px-8">
			<d-heading sixe="s">{m.Confirm_your_email()}</d-heading>
			<d-text size="l">{m.Reenter_your_email_address_to_confirm_registration_()}</d-text>

			<Form {form} formClass="flex flex-col gap-4 pb-6 pt-4 w-full">
				<Input {form} fieldPath="email" placeholder={m.emailexample_com()} label={m.Email()} />
				<d-button size="default" color="accent" type="submit" expand class="mt-4">
					{m.Next()}
					<ion-icon icon={arrowForward} slot="end" />
				</d-button>
			</Form>
		</div>
	</div>
</div>
