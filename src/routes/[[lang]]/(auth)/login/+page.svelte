<script lang="ts">
	// @ts-ignore
	import IonPage from 'ionic-svelte/components/IonPage.svelte';
	import { z } from 'zod';
	import { Form, createForm } from '$lib/components/organisms/forms';
	import Input from '$lib/components/organisms/forms/input.svelte';
	import { goto } from '$lib/i18n';
	import { userEmailStore } from './_lib';
	import { m } from '$lib/i18n';
	import { arrowForward } from 'ionicons/icons';
	import illustrations from '$lib/assets/Illustrations.png';
	import vector from '$lib/assets/Vector.png';

	//

	const schema = z.object({
		email: z.string().email(),
		rememberEmail: z.boolean().optional()
	});

	const form = createForm({
		schema,
		onSubmit: async ({ form }) => {
			userEmailStore.set(form.data.email);
			await goto('/login/confirm-email');
		}
	});
</script>

<IonPage>
	<ion-content fullscreen class="h-full">
		<div class="flex flex-col">
			<div
				class="flex h-64 w-full flex-col items-center justify-end bg-cover bg-no-repeat"
				style={`background-image:url(${vector})`}
			>
				<img src={illustrations} alt="pp" class="w-92" />
			</div>
			<div class="flex w-full flex-col items-center gap-6 px-8">
				<div class="flex w-full flex-col gap-2 bg-primary py-8">
					<d-heading sixe="s">{m.Enter_your_email()}</d-heading>
					<d-text size="l">{m.enter_your_email_to_get_started()}.</d-text>
					<!-- <d-logo /> -->
				</div>

				<Form {form} formClass="flex flex-col  gap-8 rounded bg-surface px-4 pb-6 pt-4 w-full">
					<d-text size="s" class="opacity-30">{m.Email()}</d-text>
					<Input
						{form}
						fieldPath="email"
						placeholder={m.emailexample_com()}
						label={m.type_your_email()}
					/>
					<d-button size="default" color="accent" type="submit" expand class="mt-4">
						{m.Next()}
						<ion-icon icon={arrowForward} slot="end" />
					</d-button>
				</Form>
				<div class="absolute bottom-4 flex flex-col items-center gap-2">
					<div class="flex items-center gap-2">
						<d-logo /> <d-heading size="xs">{m.DID_Wallet()}</d-heading>
					</div>
					<d-text size="l">{m.Developed_by_Forkbomb_BV()}</d-text>
					<d-text size="m">V 0.1.0123456</d-text>
				</div>
			</div>
		</div></ion-content
	>
</IonPage>
