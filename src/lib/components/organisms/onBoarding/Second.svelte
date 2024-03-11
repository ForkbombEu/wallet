<script lang="ts">
	import { createStepController } from '@efstajas/svelte-stepper';
	import StepsController from './StepsController.svelte';
	import { m } from '$lib/i18n';
	import Illustration from '../molecules/Illustration.svelte';

	export let index: number;
	export let total: number;

	const stepController = createStepController();
</script>

<div class="flex h-[100vh] flex-col justify-between">
	<Illustration img="hand-ellipsis" />
	<div class="flex h-full flex-col items-center justify-end gap-4 px-4 py-8">
		<d-heading size="s">{m.Create_your_DID()}</d-heading>
		<d-text size="m"
			>Lorem ipsum dolor sit amet consectetur. Adipiscing mauris sagittis amet arcu mauris leo.</d-text
		>
		<StepsController {index} {total} on:click={(e) => stepController.move(e.detail.value)} />
	</div>
</div>
