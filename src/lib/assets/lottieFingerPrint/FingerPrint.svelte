<script lang="ts">
	//@ts-ignore
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	import { getLottieAnimation } from '$lib/assets/lottieFingerPrint/getLottieAnimation';
</script>

<LottiePlayer
	src={getLottieAnimation()}
	autoplay={true}
	loop={true}
	renderer="svg"
	background="transparent"
	width={120}
	height={120}
	controls={false}
	controlsLayout={false}
/>
