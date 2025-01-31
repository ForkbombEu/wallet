<script lang="ts">
	import { fly } from 'svelte/transition';
	import { debugPopup, debugPopupContent } from './debug';
	import { onMount } from 'svelte';
	import { getDebugMode } from '$lib/preferences/debug';
	import { m } from '$lib/i18n';
	import CopyButton from '$lib/components/copyButton.svelte';

	const hide = async () => {
		debugPopup.set(false);
	};
	let debugMode: boolean;
	onMount(async () => {
		debugMode = await getDebugMode();
	});
</script>

<ion-modal is-open={debugMode && $debugPopup} backdrop-dismiss={false} transition:fly>
	<ion-header>
		<ion-toolbar>
			<ion-title>{m.Debug()}</ion-title>
			<ion-buttons slot="end">
				<CopyButton textToCopy={$debugPopupContent || ''} delay={1000}>{m.Copy_logs()}</CopyButton>
			</ion-buttons>
		</ion-toolbar>
	</ion-header>
	<ion-content class="ion-padding">
		<d-vertical-stack class="justify-around">
			<d-text>
				{m.To_stop_displaying_this_popup_deactivate_debugMode_in_to_the_profile()}
			</d-text>
			<d-text size="xs">
				<pre class="font-sm">
                    {$debugPopupContent}
                </pre>
			</d-text>
			<!-- <d-button on:click={download} expand aria-hidden>{m.download()}</d-button> -->
			<d-button on:click={hide} expand aria-hidden>{m.Next}</d-button>
		</d-vertical-stack>
	</ion-content>
</ion-modal>
