<script lang="ts">
	import { completeOnBoarding } from '$lib/components/onBoarding/utils';
	import OnBoardingPage from '$lib/components/onBoarding/OnBoardingPage.svelte';
	import background1 from '$lib/assets/bg-1.svg';
	import background2 from '$lib/assets/bg-2.svg';
	import background3 from '$lib/assets/bg-3.svg';
	import { m } from '$lib/i18n';
	import { register } from 'swiper/element/bundle';
	import LogoHand from '$lib/assets/LogoHand.svelte';
	import HandEllipsis from '$lib/assets/HandEllipsis.svelte';
	import HandCard from '$lib/assets/HandCard.svelte';

	register();
</script>

<ion-content fullscreen>
	<swiper-container
		centered-slides={true}
		pagination={true}
		centeredSlides={true}
		class="mt-8 h-5/6"
	>
		<OnBoardingPage
			title={m.Welcome_to_DID_Wallet()}
			subtitle={m.your_friendly_and_trustable_opensource_wallet_()}
			description={m.on_boarding_subtitle_1()}
			background={background1}><LogoHand /></OnBoardingPage
		>
		<OnBoardingPage
			title={m.Create_your_DID()}
			description={m.on_boarding_subtitle_2()}
			background={background2}><HandEllipsis /></OnBoardingPage
		>
		<OnBoardingPage
			title={m.Manage_VC_verifiable_credentials_in_one_place()}
			description={m.Manage_VC_verifiable_credentials_in_one_place()}
			background={background3}
		><HandCard /></OnBoardingPage>
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
