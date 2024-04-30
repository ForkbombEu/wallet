<script lang="ts">
	import { goto, r } from '$lib/i18n/index.js';
	import dayjs from 'dayjs';
	import { onMount } from 'svelte';
	import { clearLogsPreferences } from '$lib/preferences/logs.js';
	import { clearPreferences } from '$lib/preferences/index.js';
	export let data;
	let element: HTMLElement;
	$: if (logs && element) scrollToBottom(element);
	onMount(() => {
		if (logs && element) scrollToBottom(element);
	});
	const scrollToBottom = async (node: HTMLElement) => {
		node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
	};
	const clear = async () => {
		await clearLogsPreferences();
		window.location.reload()
	};
	const { logs } = data;
</script>

<div class="ion-padding flex h-screen flex-col gap-4 overflow-auto" bind:this={element}>
	<div class="flex gap-2">
		<d-button href={r('/home')}> back </d-button>
		<d-button on:click={clear}> clear </d-button>
		<d-button on:click={clearPreferences}> clear storage </d-button>
	</div>
	{#if logs}
		{#each logs as log}
			{@const date = dayjs(log.date)}
			<div class="flex gap-2 rounded-md border border-on bg-primary p-2">
				<div class="flex flex-col">
					<div class="text-sm text-on">{date.format('YY/MM/DD')}</div>
					<div class="text-sm text-on">{date.format('HH:mm:ss')}</div>
				</div>
				<div class="break-all text-sm text-on">{log.message}</div>
			</div>
		{/each}
	{/if}
</div>
