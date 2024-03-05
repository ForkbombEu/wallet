<script lang="ts">
	import { Clipboard } from '@capacitor/clipboard';
	import { m } from '$lib/i18n';

	export let textToCopy: string;
	export let delay = 2000;

	let isCopied = false;

	async function copyText() {
		await Clipboard.write({
			string: textToCopy
		});

		isCopied = true;
		setTimeout(() => {
			isCopied = false;
		}, delay);
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-interactive-supports-focus -->
<d-button role="button" on:click={copyText} color="accent">
	{#if !isCopied}
		<span slot="start">📄</span>
		<slot />
	{:else}
		<span slot="start">✅</span>
		{m.Copied()}
	{/if}
</d-button>
