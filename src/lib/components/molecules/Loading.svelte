<script lang="ts">
	import FingerPrint from '$lib/assets/lottieFingerPrint/FingerPrint.svelte';

	export let loading: boolean = true
	export let message: string | undefined = undefined
</script>

{#if loading}
	<div
		class="fixed z-50 flex h-full min-h-screen w-full flex-col items-center justify-around bg-surface ion-padding opacity-90"
	>
		<div class="flex flex-col items-center gap-8">
			<FingerPrint/>
			{#if message}
                <d-heading size="s">{message}</d-heading>
            {/if}
		</div>
	</div>
{/if}
