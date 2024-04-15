<script lang="ts">
	import { FieldController, Form, FormError, createForm } from '$lib/forms';
	import { goto, m, r } from '$lib/i18n';
	import { regenerateKeypair } from '$lib/keypairoom';
	import { setKeypairPreference } from '$lib/preferences/keypair.js';
	import { unlockApp } from '$lib/preferences/locked.js';
	import { z } from 'zod';
 	import type { Feedback } from '$lib/utils/types.js';
	import { checkKeypairs, generateDid } from '../../_lib/index.js';
	import { clearPreferences } from '$lib/preferences/index.js';

	//

	export let data;
	let { userEmail } = data;

	let feedback: Feedback = {};

	//

	const passphraseSchema = z.object({
		seed: z
			.string()
			.min(1)
			.refine((v) => v.split(' ').length === 12)
	});

	const form = createForm({
		schema: passphraseSchema,
		onSubmit: async ({ form }) => {
			try {
				const keypair = await regenerateKeypair(userEmail, form.data.seed);
				await setKeypairPreference(keypair);
				await generateDid(userEmail);
				await checkKeypairs()
				await unlockApp();
				await goto('/wallet'); // Note: `goto` needs `await`!
			} catch (e) {
				feedback = {
					type: 'error',
					message: JSON.stringify(e),
					feedback: 'error while regenerating keypair'
				};
				clearPreferences();
				throw new Error('KEYPAIR_REGENERATION_ERROR');
			}
		}
	});

	//

	const seedPlaceholder = 'skin buyer sunset person run push elevator under debris soft surge man';
</script>

<div class="ion-padding flex min-h-screen flex-col place-content-between">
	<d-feedback {...feedback} />
	<div class="flex flex-col gap-2">
		<d-heading sixe="s">{m.Enter_your_keypair()}</d-heading>
		<d-text size="l"
			>{m.if_you_have_stored_your_keypair_securely_you_can_enter_it_below_to_access_your_wallet_()}</d-text
		>
		<p>{m.Login_using_your_keypair()}</p>
	</div>
	<Form {form}>
		<div class="space-y-6">
			<FieldController {form} fieldPath="seed" let:value let:updateValue>
				<ion-textarea
					placeholder={seedPlaceholder}
					{value}
					on:ionChange={(e) => updateValue(e.target.value)}
				/>
			</FieldController>

			<FormError {form} let:errorMessage>
				<ion-text color="danger">
					{errorMessage}
				</ion-text>
			</FormError>
		</div>
		<div class="flex flex-col gap-6">
			<d-button role="button" expand type="submit" tabindex={0}>{m.Login()}</d-button>

			<d-button color="outline" href={r('/login/questions')} role="button" expand>
				{m.KEYPAIR_RECOVERY()}
			</d-button>
		</div>
	</Form>
</div>
