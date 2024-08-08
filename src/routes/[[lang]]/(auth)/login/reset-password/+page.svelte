<script lang="ts">
	import { Form, createForm } from '$lib/forms';
	import { m } from '$lib/i18n';
	import Input from '$lib/forms/input.svelte';
	import { arrowForward } from 'ionicons/icons';
	import { z } from 'zod';
	import background from '$lib/assets/bg-4.svg';
	import { askResetPassword } from '../_lib';
	import type { Feedback } from '$lib/utils/types';
	import CircleCheck from '$lib/assets/CircleCheck.svelte';
	import Chat from '$lib/assets/Chat.svelte';
	import { routeHistory } from '$lib/routeStore';
	import FingerPrint from '$lib/assets/lottieFingerPrint/FingerPrint.svelte';

	let feedback: Feedback = {};
	let loading = false;
	let requestSent = false;

	const schema = z.object({
		email: z.string().email()
	});

	const form = createForm({
		schema,
		onSubmit: async ({ form }) => {
			try {
				loading = true;
				const res = await askResetPassword(form.data.email);
				//@ts-ignore
				if (!res.res) throw new Error('no request sent');
				requestSent = true;
				loading = false;
			} catch (e) {
				loading = false;
				feedback = {
					type: 'error',
					feedback: 'Something went wrong',
					message: String(exports)
				};
			}
		}
	});

	const back = () => {
		window.history.back();
	};
</script>

<d-loading {loading}>
	<FingerPrint />
</d-loading>
<d-header back-button backFunction={routeHistory.back}>
	{m.Reset_password()}
</d-header>
<div class="flex min-h-screen flex-col place-content-between">
	<d-feedback {...feedback} />
	<div class="grow">
		<d-illustration {background}>
			<Chat />
		</d-illustration>
		<div>
			{#if requestSent}
				<div class="mt-8 flex flex-col">
					<div class="flex w-full flex-col items-center gap-4 px-8">
						<div class="flex w-full flex-col gap-2 pt-8">
							<div class="mx-auto">
								<CircleCheck />
							</div>
							<d-heading size="s">{m.Request_sent()}</d-heading>
							<d-text size="l">{m.Check_your_email_for_further_instructions()}</d-text>
						</div>
						<div class="w-full">
							<d-button
								expand
								on:click={back}
								on:keydown={back}
								aria-hidden
								color="accent"
								class="mt-4"
							>
								{m.OK()}
							</d-button>
						</div>
					</div>
				</div>
			{:else}
				<div class="flex flex-col">
					<div class="flex w-full flex-col items-center gap-4 px-8">
						<div class="flex w-full flex-col gap-2 pt-8">
							<d-heading sixe="s">{m.reset_your_password()}</d-heading>
							<d-text size="l">{m.enter_your_email_to_get_started()}.</d-text>
						</div>

						<Form {form} formClass="flex flex-col gap-4 pb-6 pt-4 w-full" let:isTainted>
							<Input
								{form}
								fieldPath="email"
								placeholder={m.emailexample_com()}
								label={m.Email()}
								type="email"
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
								<ion-icon icon={arrowForward} slot="end" />
							</d-button>
						</Form>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
