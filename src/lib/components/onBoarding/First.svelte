<script lang="ts">
	import { createStepController } from '@efstajas/svelte-stepper';
	import StepsController from './StepsController.svelte';
	import { m } from '$lib/i18n';
	export let index: number;
	export let total: number;
	const stepController = createStepController();
</script>

<img src="https://placehold.co/400x600.png" alt="placeholder" />
<div class="flex h-full flex-col items-center justify-around gap-2 px-4">
	<d-heading size="s">{m.Welcome_to_DID_Wallet()},</d-heading>
	<d-text size="xl" class="pb-4">{m.your_friendly_and_trustable_opensource_wallet_()}</d-text>
	<d-text size="m"
		>Lorem ipsum dolor sit amet consectetur. Adipiscing mauris sagittis amet arcu mauris leo.</d-text
	>
	<StepsController {index} {total} on:click={(e) => stepController.move(e.detail.value)} />
</div>
