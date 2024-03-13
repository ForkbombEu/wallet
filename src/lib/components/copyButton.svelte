<script lang="ts">
	import { m } from '$lib/i18n';
	import { Clipboard } from '@capacitor/clipboard';
	import { checkmarkOutline, clipboardOutline } from 'ionicons/icons';

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
<d-button role="button" on:click={copyText} color="outline" class="text-on" expand>
	{#if !isCopied}
		<span slot="end"><ion-icon icon={clipboardOutline} /></span>
		<slot />
	{:else}
		<span slot="end">
			<ion-icon icon={checkmarkOutline} />
		</span>
		{m.Copied()}
	{/if}
</d-button>
