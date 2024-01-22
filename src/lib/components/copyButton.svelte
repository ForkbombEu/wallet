<script lang="ts">
	import { Clipboard } from '@capacitor/clipboard';

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
<ion-button role="button" on:click={copyText} color="light">
	{#if !isCopied}
		<span>📄</span>
		<span class="ml-2">
			<slot />
		</span>
	{:else}
		<span class="whitespace-nowrap">✅ Copied!</span>
	{/if}
</ion-button>
