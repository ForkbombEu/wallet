<script lang="ts">
	import { fly } from 'svelte/transition';
	import { debugPopup, debugPopupContent } from './debug';
	import { onMount } from 'svelte';
	import { getDebugMode } from '$lib/preferences/debug';
	let display: boolean;
    const hide = async ()=> {
        debugPopup.set(false)
        display = false
    }
    let debugMode: boolean;
    onMount(async () => {
        debugMode = await getDebugMode();
    });
</script>

<ion-modal is-open={debugMode&&$debugPopup} backdrop-dismiss={false} transition:fly class="visible">
	<ion-content class="ion-padding">
		<d-vertical-stack class="h-full justify-around">
			{#if !display}
				<d-text> To stop displaying this popup deactivate debugMode in to the profile </d-text>
				<d-buttons-group>
					<d-button on:click={() => (display = true)} aria-hidden>display</d-button>
					<d-button>download</d-button>
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
