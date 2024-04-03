<script lang="ts">
	import First from '$lib/components/onBoarding/First.svelte';
	import Second from '$lib/components/onBoarding/Second.svelte';
	import Third from '$lib/components/onBoarding/Third.svelte';
	import { completeOnBoarding } from '$lib/components/onBoarding/utils';
	import { m } from '$lib/i18n';
	import { register } from 'swiper/element/bundle';

	register();
</script>

<ion-content fullscreen>
	<swiper-container
		centered-slides={true}
		pagination={true}
		centeredSlides={true}
		class="mt-8 h-5/6"
	>
		<swiper-slide class="h-full"><First /> </swiper-slide>
		<swiper-slide class="h-full"><Second /> </swiper-slide>
		<swiper-slide class="h-full"><Third /> </swiper-slide>
	</swiper-container>
	<div class="flex justify-center">
		<d-button
			aria-hidden
			clear
			color="accent"
			class="underline"
			on:click={completeOnBoarding}
			on:keydown={completeOnBoarding}
		>
			{m.SKIP()}
		</d-button>
	</div>
</ion-content>
