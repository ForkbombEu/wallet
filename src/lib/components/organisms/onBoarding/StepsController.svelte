<script lang="ts">
	import { createStepController } from '@efstajas/svelte-stepper';
	import Dot from './dot.svelte';
	import { completeOnBoarding } from './utils';
	import { createEventDispatcher } from 'svelte';

	export let index: number;
	export let total: number;

	const dispatch = createEventDispatcher();

	function onEllipsisClick(by: number) {
		dispatch('click', {
			value: by
		});
	}

</script>

<div class="flex-col flex items-center">
	<div class="flex gap-2">
		{#each Array.from(Array(total).keys()) as page}
			{#if page === index}
				<Dot />
			{:else}
				<button class="opacity-30" on:click={() => onEllipsisClick(page - index)}>
					<Dot />
				</button>
			{/if}
		{/each}
	</div>

	<d-button
		on:click={completeOnBoarding}
		on:keydown={completeOnBoarding}
		aria-hidden
		clear
		color="accent"
	>
		{#if index === total - 1}
			Complete
		{:else}
			Skip
		{/if}
	</d-button>
</div>
