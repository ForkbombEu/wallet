<script lang="ts">
	import { fly } from 'svelte/transition';
	import { debugPopup, debugPopupContent } from './debug';
	import { onMount } from 'svelte';
	import { getDebugMode } from '$lib/preferences/debug';
	import { Capacitor } from '@capacitor/core';
	import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
	let display: boolean;
	const hide = async () => {
		debugPopup.set(false);
		display = false;
	};
	let debugMode: boolean;
	onMount(async () => {
		debugMode = await getDebugMode();
	});
	const isWeb = Capacitor.getPlatform() === 'web';
	const download = async () => {
		if (isWeb) {
			const blob = new Blob([$debugPopupContent || ''], { type: 'text/plain' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'debug.txt';
			a.click();
			URL.revokeObjectURL(url);
			return;
		}
		const path = 'debug.txt';
		await Filesystem.writeFile({
			path,
			data: $debugPopupContent || '',
			directory: Directory.Documents,
            encoding: Encoding.UTF8
		});
	};
</script>

<ion-modal is-open={debugMode && $debugPopup} backdrop-dismiss={false} transition:fly>
	<ion-header>
		<ion-toolbar>
			<ion-title>Debug</ion-title>
		</ion-toolbar>
	</ion-header>
	<ion-content class="ion-padding">
		<d-vertical-stack class="justify-around">
			{#if !display}
				<d-text> To stop displaying this popup deactivate debugMode in to the profile </d-text>
				<d-buttons-group>
					<d-button on:click={() => (display = true)} aria-hidden>display</d-button>
					<d-button on:click={download} aria-hidden>download</d-button>
					<d-button on:click={hide} aria-hidden>skip</d-button>
				</d-buttons-group>
			{:else}
				<d-text size="xs">
					<pre class="font-sm">
                        {$debugPopupContent}
                    </pre>
				</d-text>
				<d-button on:click={hide} expand aria-hidden>continue</d-button>
			{/if}
		</d-vertical-stack>
	</ion-content>
</ion-modal>
