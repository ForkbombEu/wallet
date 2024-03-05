<script lang="ts">
	import { createStepController } from '@efstajas/svelte-stepper';
	import StepsController from './StepsController.svelte';
	import { m } from '$lib/i18n';
	import Illustration from './Illustration.svelte';
	export let index: number;
	export let total: number;
	const stepController = createStepController();
</script>

<div class="flex h-[100vh] flex-col justify-between">
	<Illustration img="logo-hand" />
	<div class="flex h-full flex-col items-center justify-end gap-4 px-4 py-8">
		<d-heading size="s">{m.Welcome_to_DID_Wallet()},</d-heading>
		<d-text size="xl" class="pb-4">{m.your_friendly_and_trustable_opensource_wallet_()}</d-text>
		<d-text size="m"
			>Lorem ipsum dolor sit amet consectetur. Adipiscing mauris sagittis amet arcu mauris leo.</d-text
		>
		<StepsController {index} {total} on:click={(e) => stepController.move(e.detail.value)} />
	</div>
</div>
