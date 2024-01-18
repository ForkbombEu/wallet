<script lang="ts">
	import { IonPage } from 'ionic-svelte';
	import Logo from '$lib/components/atoms/Logo.svelte';
	import { z } from 'zod';
	import { Form, createForm } from '$lib/forms';
	import Input from '$lib/ionic/forms/input.svelte';

	const schema = z.object({
		email: z.string().email(),
		rememberEmail: z.boolean().optional()
	});

	const form = createForm({
		schema,
		onSubmit: async ({ form }) => {
			console.log(form.data);
		}
	});
</script>

<IonPage>
	<ion-content fullscreen>
		<div class="flex h-full w-full flex-col items-center justify-center">
			<Logo />
			<h1 class="text-2xl">Welcome!</h1>
			<p class="opacity-60">Enter your email to get started</p>
			<Form {form}>
				<Input {form} fieldPath="email" />
			</Form>
		</div>
	</ion-content>
</IonPage>
