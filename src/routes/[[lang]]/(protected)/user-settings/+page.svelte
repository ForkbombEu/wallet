<script lang="ts">
	import { createForm, Form, Input } from '$lib/forms';
	import { z } from 'zod';
	import type { Feedback } from '$lib/utils/types';
	import FingerPrint from '$lib/assets/lottieFingerPrint/FingerPrint.svelte';
	import { m } from '$lib/i18n';
	import HeaderWithBackButton from '$lib/components/molecules/HeaderWithBackButton.svelte';

	let loading = false;

	const schema = z.object({
		name: z.string().min(1, 'Name is required'),
		email: z.string().email('Invalid email address')
	});

	const form = createForm({
		schema,
		onSubmit: async ({ form }) => {
			try {
				loading = true;
			} catch (error) {}
		}
	});
</script>

<HeaderWithBackButton>User Settings</HeaderWithBackButton>

<div class="flex w-full flex-col items-center gap-6 px-8">
	<d-heading sixe="s">{m.Choose_your_password()}</d-heading>
	<d-text size="l">{m.Your_password_should_be_between_8_and_73_character()}</d-text>
	<d-loading {loading}>
		<FingerPrint />
	</d-loading>
	<Form {form} formClass="flex flex-col gap-4 pb-6 pt-4 w-full">
		<Input
			{form}
			fieldPath="email"
			placeholder={m.emailexample_com()}
			label={m.Email()}
			type="email"
		/>
		<Input {form} fieldPath="name" placeholder={'m.John_Doe()'} label={'m.Name()'} type="text" />
		<d-button size="default" color="accent" type="submit" expand class="mt-4">
			{'m.Next()'}
		</d-button>
	</Form>
</div>
