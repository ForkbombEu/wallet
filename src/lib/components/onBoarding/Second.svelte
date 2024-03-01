<script lang="ts">
	import { createStepController } from '@efstajas/svelte-stepper';
	import StepsController from './StepsController.svelte';
	import { m } from '$lib/i18n';

	export let index: number;
	export let total: number;
  
	const stepController = createStepController();
</script>

<img src="https://placehold.co/400x600.png" alt="placeholder" />
<div class="flex h-full flex-col items-center justify-between gap-4 px-4">
	<d-heading size="s">{m.Create_your_DID()}</d-heading>
	<d-text size="m"
		>Lorem ipsum dolor sit amet consectetur. Adipiscing mauris sagittis amet arcu mauris leo.</d-text
	>
	<StepsController {index} {total} on:click={(e) => stepController.move(e.detail.value)} />
</div>
