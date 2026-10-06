<script lang="ts">
	import WalletFeedback from '$lib/components/molecules/Feedback.svelte';
	import { Form, Input, createForm } from '$lib/forms';
	import { goto, m, r } from '$lib/i18n';
	import { regenerateKeypair } from '$lib/keypairoom';
	import { setKeypairPreference } from '$lib/preferences/keypair.js';
	import { z } from 'zod';
	import type { Feedback } from '$lib/utils/types.js';
	import { checkKeypairs, generateDid } from '../../_lib/index.js';
	import background from '$lib/assets/bg-5.svg';
	import HeaderWithBackButton from '$lib/components/molecules/HeaderWithBackButton.svelte';
	import { setUserPassword } from '$lib/preferences/userPassword.js';

	let { data } = $props();
	const { userEmail, password } = data;
	let feedback = $state<Feedback>({});
	let loading = $state(false);

	const passphraseSchema = z.object({
		seed: z
			.string()
			.transform((value) => value.trim().replace(/\s+/g, ' '))
			.refine((value) => value.split(' ').length === 12, m.Passphrase_invalid())
	});

	const form = createForm({
		schema: passphraseSchema,
		onSubmit: async ({ form }) => {
			if (loading) return;
			loading = true;
			feedback = {};
			try {
				const keypair = await regenerateKeypair(userEmail, form.data.seed);
				await setKeypairPreference(keypair);
				await generateDid();
				await checkKeypairs();
				await setUserPassword(password!);
				await goto('/wallet');
			} catch {
				feedback = { type: 'error', feedback: m.Passphrase_failed_help() };
			} finally {
				loading = false;
			}
		}
	});
</script>

<HeaderWithBackButton>{m.Login()}</HeaderWithBackButton>
<div class="auth-task">
	<WalletFeedback {...feedback} />
	<d-background-illustration {background} compact aria-hidden="true">
		<d-illustration illustration="chat" />
	</d-background-illustration>
	<d-heading size="s" level={1}>{m.Login_using_your_keypair()}</d-heading>
	<p class="text-on-alt">{m.Authentication_step({ current: 2, total: 2 })}</p>
	<d-text>{m.Passphrase_help()}</d-text>
	<Form {form} formClass="flex w-full flex-col gap-4" let:isTainted>
		<Input
			{form}
			fieldPath="seed"
			label={m.Passphrase_label()}
			type="password"
			hidable
			disabled={loading}
		/>
		<d-button expand type="submit" disabled={!isTainted || loading} color="accent">
			{m.Login()}
		</d-button>
		<d-button color="outline" href={r('/login/questions')} expand disabled={loading}>
			{m.Recover_with_questions()}
		</d-button>
	</Form>
</div>
