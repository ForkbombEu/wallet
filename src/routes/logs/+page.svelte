<script lang="ts">
	import { r } from '$lib/i18n/index.js';
	import dayjs from 'dayjs';
	import { onMount } from 'svelte';
	export let data;
	let element: HTMLElement;
	$: if (logs) scrollToBottom(element);
	onMount(() => {if (logs)scrollToBottom(element)})
	const scrollToBottom = async (node: HTMLElement) => {
		node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
	};
	const { logs } = data;
</script>

<div class="ion-padding flex h-screen flex-col gap-4 overflow-auto" bind:this={element}>
	<d-button href={r('/home')}> back </d-button>
	{#each logs as log}
		{@const date = dayjs(log.date)}
		<div class="flex gap-2 rounded-md border border-on bg-primary p-2">
			<div class="flex flex-col">
				<div class="text-sm text-on">{date.format('YY/MM/DD')}</div>
				<div class="text-sm text-on">{date.format('HH:mm:ss')}</div>
			</div>
			<div class="text-sm text-on">{log.message}</div>
		</div>
	{/each}
</div>
