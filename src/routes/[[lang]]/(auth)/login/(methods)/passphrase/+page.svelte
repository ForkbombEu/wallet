<script lang="ts">
	import { Form, createForm } from '$lib/forms';
	import { goto, m, r } from '$lib/i18n';
	import { regenerateKeypair } from '$lib/keypairoom';
	import { setKeypairPreference } from '$lib/preferences/keypair.js';
	import { unlockApp } from '$lib/preferences/locked.js';
	import { z } from 'zod';
	import type { Feedback } from '$lib/utils/types.js';
	import { checkKeypairs, generateDid } from '../../_lib/index.js';
	import Illustration from '$lib/components/molecules/Illustration.svelte';
	import Header from '$lib/components/molecules/Header.svelte';
	import background from '$lib/assets/bg-5.svg';
	import { Input } from '$lib/ionic/forms/index.js';
	import Chat from '$lib/assets/Chat.svelte';

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
				await generateDid();
				await checkKeypairs();
				await unlockApp();
				await goto('/wallet');
			} catch (e) {
				feedback = {
					type: 'error',
					message: String(e),
					feedback: 'error while regenerating keyring'
				};
				throw new Error('KEYRING_REGENERATION_ERROR');
			}
		}
	});

	//

	const seedPlaceholder = 'skin buyer sunset person run push elevator under debris soft surge man';
</script>

<Header>{m.REGISTER()}</Header>

<div class="flex flex-col">
	<d-feedback {...feedback} />
	<div class="mb-10 sm:mb-0">
		<Illustration {background}>
			<Chat />
		</Illustration>
	</div>
	<div>
		<div class="flex w-full flex-col items-center gap-6 px-8">
			<d-heading size="m">{m.Enter_your_keypair()}</d-heading>
			<d-text size="l"
				>{m.if_you_have_stored_your_keypair_securely_you_can_enter_it_below_to_access_your_wallet_()}</d-text
			>
			<d-heading size="s">{m.Login_using_your_keypair()}</d-heading>
			<Form {form} formClass="flex flex-col gap-4 pb-6 pt-4 w-full">
				<Input
					{form}
					fieldPath="seed"
					placeholder={seedPlaceholder}
					label="insert your passphrase"
					type="text"
				/>
				<d-button role="button" expand type="submit" tabindex={0}>{m.Login()}</d-button>

				<d-button color="outline" href={r('/login/questions')} role="button" expand>
					{m.KEYPAIR_RECOVERY()}
				</d-button>
			</Form>
		</div>
	</div>
</div>
