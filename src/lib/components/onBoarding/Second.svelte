<script lang="ts">
	import { m } from '$lib/i18n';
	import { createStepController } from '@efstajas/svelte-stepper';
	import background from '$lib/assets/bg-2.svg';
	import Illustration from '../molecules/Illustration.svelte';
	import StepsController from './StepsController.svelte';

	export let index: number;
	export let total: number;

	const stepController = createStepController();
</script>


<div class="flex h-screen flex-col justify-between">
	<div class="relative">
		<img
			src={background}
			class="max-h-[50vh] w-full fill-[var(--highlight)] opacity-50"
			alt="background"
		/>
	<Illustration img="hand-ellipsis" />
	</div>
		<d-heading size="s">{m.Create_your_DID()}</d-heading>
	<d-text size="m"
		>Lorem ipsum dolor sit amet consectetur. Adipiscing mauris sagittis amet arcu mauris leo.</d-text
	>
	<div class="flex h-full flex-col items-center justify-end gap-4 px-4 py-8">
		<StepsController {index} {total} on:click={(e) => stepController.move(e.detail.value)} />
	</div>
</div>