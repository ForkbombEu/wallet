<script lang="ts">
	import { fly } from 'svelte/transition';
	import { debugPopup, debugPopupContent } from './debug';
	import { onMount } from 'svelte';
	import { getDebugMode } from '$lib/preferences/debug';
	import { Capacitor } from '@capacitor/core';
	import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
	import { m } from '$lib/i18n';
	const hide = async () => {
		debugPopup.set(false);
	};
	let debugMode: boolean;
	onMount(async () => {
		debugMode = await getDebugMode();
	});
	const isWeb = Capacitor.getPlatform() == 'web';
	let loading = false;
	let path: string;
	let message: string;
	const download = async () => {
		const blob = new Blob([$debugPopupContent || ''], { type: 'text/plain' });
		if (isWeb) {
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'debug.txt';
			a.click();
			URL.revokeObjectURL(url);
			return;
		}

		path = `debug/${new Date().toISOString()}.txt`;
		message = m.Writing()
		loading = true;
		await Filesystem.writeFile({
			path,
			data: blob,
			directory: Directory.Documents,
			recursive: true
		}).catch((e) => {
			loading = false;
		});
		setTimeout(() => {
			message = 'm.File_saved_to' + path;
			loading = false;
		}, 2000);
	};
</script>

<ion-modal is-open={debugMode && $debugPopup} backdrop-dismiss={false} transition:fly>
	<ion-header>
		<ion-toolbar>
			<ion-title>{m.Debug()}</ion-title>
		</ion-toolbar>
	</ion-header>
	<ion-content class="ion-padding">
		<d-loading {loading}>
			{message}
		</d-loading>
		<d-vertical-stack class="justify-around">
			<d-text>
				{m.To_stop_displaying_this_popup_deactivate_debugMode_in_to_the_profile()}
			</d-text>
			<d-text size="xs">
				<pre class="font-sm">
                    {$debugPopupContent}
                </pre>
			</d-text>
			<d-button on:click={download} expand aria-hidden>{m.download()}</d-button>
			<d-button on:click={hide} expand aria-hidden>{m.SKIP()}</d-button>
		</d-vertical-stack>
	</ion-content>
</ion-modal>
