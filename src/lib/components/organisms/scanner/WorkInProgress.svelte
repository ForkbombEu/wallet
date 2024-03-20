<script lang="ts">
	import { m } from '$lib/i18n';
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	import wip from '$lib/assets/wip.json?raw';
</script>

<div class="flex h-full flex-col items-center justify-center">
	<LottiePlayer
		src={wip}
		autoplay={true}
		loop={true}
		renderer="svg"
		background="transparent"
		width={250}
	/>
	<h1 class="mt-4 text-2xl font-bold">{m.Work_in_progress()}</h1>
</div>
