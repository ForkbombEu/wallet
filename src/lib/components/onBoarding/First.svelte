<script lang="ts">
	import { createStepController } from '@efstajas/svelte-stepper';
	export let index: number;
	export let total: number;
	import StepsController from './StepsController.svelte';
	const stepController = createStepController();
</script>

<img src="https://placehold.co/400x600.png" alt="placeholder" />
<div class="flex h-full flex-col items-center justify-around gap-2 px-4">
	<d-heading size="s">Welcome to DID Wallet,</d-heading>
	<d-text size="xl" class="pb-4">your friendly and trustable open-source wallet.</d-text>
	<d-text size="m"
		>Lorem ipsum dolor sit amet consectetur. Adipiscing mauris sagittis amet arcu mauris leo.</d-text
	>
	<StepsController {index} {total} on:click={(e) => stepController.move(e.detail.value)} />
</div>
