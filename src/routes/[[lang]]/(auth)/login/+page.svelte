<script lang="ts">
	// @ts-ignore
	import IonPage from 'ionic-svelte/components/IonPage.svelte';
	import { z } from 'zod';
	import { Form, createForm } from '$lib/forms';
	import Input from '$lib/ionic/forms/input.svelte';
	import { goto } from '$lib/i18n';
	import { userEmailStore } from './_lib';

	//

	const schema = z.object({
		email: z.string().email(),
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

<IonPage>
	<ion-content fullscreen>
		<div class="flex h-full w-full flex-col items-center justify-center gap-6">
			<div class="flex flex-col items-center gap-2">
				<d-logo />
				<h1 class="text-2xl">Welcome!</h1>
			</div>

			<Form {form}>
				<p class="opacity-60">Enter your email to get started</p>
				<Input {form} fieldPath="email" placeholder="email@example.com" />
				<d-button size="default" color="accent" type="submit" class="mt-4">Next</d-button>
			</Form>
		</div>
	</ion-content>
</IonPage>
