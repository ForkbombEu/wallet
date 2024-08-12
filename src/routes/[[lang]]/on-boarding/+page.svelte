<script lang="ts">
	import { completeOnBoarding } from '$lib/preferences/onBoarding';
	import background1 from '$lib/assets/bg-1.svg';
	import background2 from '$lib/assets/bg-2.svg';
	import background3 from '$lib/assets/bg-3.svg';
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
		<swiper-slide class="h-full">
			<d-swipable-page
				title={m.Welcome_to_DID_Wallet()}
				subtitle={m.your_friendly_and_trustable_opensource_wallet_()}
				description={m.on_boarding_subtitle_1()}
				background={background1}
			>
				<d-illustration illustration="logo-hand" />
			</d-swipable-page>
		</swiper-slide>
		<swiper-slide class="h-full">
			<d-swipable-page
				title={m.Create_your_DID()}
				description={m.on_boarding_subtitle_2()}
				background={background2}
			>
				<d-illustration illustration="hand-ellipsis" />
			</d-swipable-page>
		</swiper-slide>
		<swiper-slide class="h-full">
			<d-swipable-page
				title={m.Manage_VC_verifiable_credentials_in_one_place()}
				description={m.Manage_VC_verifiable_credentials_in_one_place()}
				background={background3}
			>
				<d-illustration illustration="hand-card" />
			</d-swipable-page>
		</swiper-slide>
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
