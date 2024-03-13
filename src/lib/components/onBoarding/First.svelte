<script lang="ts">
	import { m } from '$lib/i18n';
	import { createStepController } from '@efstajas/svelte-stepper';
	import Illustration from '../molecules/Illustration.svelte';
	import StepsController from './StepsController.svelte';
	export let index: number;
	export let total: number;
	const stepController = createStepController();
</script>

<div class="flex h-screen flex-col justify-between">
	<div class="relative">
		<img
			src="/src/lib/assets/bg-1.svg"
			class="max-h-[50vh] w-full shrink-0 fill-[var(--highlight)] opacity-50"
			alt="background"
		/>
		<Illustration img="logo-hand" />
	</div>
	<d-heading size="s">{m.Welcome_to_DID_Wallet()},</d-heading>
	<d-text size="xl" class="pb-4">{m.your_friendly_and_trustable_opensource_wallet_()}</d-text>
	<d-text size="m"
		>Lorem ipsum dolor sit amet consectetur. Adipiscing mauris sagittis amet arcu mauris leo.</d-text
	>
	<div class="flex h-full flex-col items-center justify-end gap-4 px-4 py-8">
		<StepsController {index} {total} on:click={(e) => stepController.move(e.detail.value)} />
	</div>
</div>
