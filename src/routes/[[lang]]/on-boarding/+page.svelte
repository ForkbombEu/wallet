<script lang="ts">
	import { onMount } from 'svelte';
	import { completeOnBoarding } from '$lib/preferences/onBoarding';
	import background1 from '$lib/assets/bg-1.svg';
	import background2 from '$lib/assets/bg-2.svg';
	import background3 from '$lib/assets/bg-3.svg';
	import { m } from '$lib/i18n';
	import { register } from 'swiper/element/bundle';

	register();
	type OnboardingSwiper = HTMLElement & {
		initialize(): void;
		swiper: { activeIndex: number; slideNext(): void; updateAutoHeight(speed?: number): void };
	};
	let swiper: OnboardingSwiper;
	let currentSlide = 0;

	onMount(() => {
		Object.assign(swiper, {
			speed: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 300,
			a11y: { enabled: true }
		});
		swiper.initialize();
		// Stencil content and SVG assets render after Swiper's initial measurement.
		const observer = new ResizeObserver(() => swiper.swiper?.updateAutoHeight(0));
		swiper.querySelectorAll('swiper-slide').forEach((slide) => observer.observe(slide));
		return () => observer.disconnect();
	});

	const next = () => {
		if (currentSlide === 2) void completeOnBoarding();
		else swiper.swiper.slideNext();
	};
</script>

<ion-content fullscreen class="ion-padding">
	<div class="onboarding-flow">
		<swiper-container
			bind:this={swiper}
			init="false"
			auto-height={true}
			on:swiperslidechange={() => (currentSlide = swiper.swiper.activeIndex)}
		>
			<swiper-slide aria-hidden={currentSlide !== 0}>
				<d-swipable-page
					title={m.Onboarding_store_title()}
					description={m.Onboarding_store_description()}
					background={background1}
				>
					<d-illustration illustration="logo-hand" aria-hidden="true" />
				</d-swipable-page>
			</swiper-slide>
			<swiper-slide aria-hidden={currentSlide !== 1}>
				<d-swipable-page
					title={m.Onboarding_share_title()}
					description={m.Onboarding_share_description()}
					background={background2}
				>
					<d-illustration illustration="hand-ellipsis" aria-hidden="true" />
				</d-swipable-page>
			</swiper-slide>
			<swiper-slide aria-hidden={currentSlide !== 2}>
				<d-swipable-page
					title={m.Onboarding_start_title()}
					description={m.Onboarding_start_description()}
					background={background3}
				>
					<d-illustration illustration="hand-card" aria-hidden="true" />
				</d-swipable-page>
			</swiper-slide>
		</swiper-container>
		<p class="text-center text-on-alt" aria-live="polite">
			{m.Authentication_step({ current: currentSlide + 1, total: 3 })}
		</p>
		<d-button expand color="accent" on:click={next}>
			{currentSlide === 2 ? m.Get_started() : m.Continue()}
		</d-button>
		<d-button clear color="accent" on:click={completeOnBoarding}>{m.SKIP()}</d-button>
		<details class="mt-2">
			<summary>{m.About_wallet_standards()}</summary>
			<p class="mt-2 text-on-alt">{m.on_boarding_subtitle_1()}</p>
		</details>
	</div>
</ion-content>

<style>
	.onboarding-flow {
		max-width: 36rem;
		margin-inline: auto;
		padding-block: 1rem max(1rem, env(safe-area-inset-bottom));
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	swiper-container {
		width: 100%;
		padding-bottom: 2rem;
	}
	swiper-slide {
		height: auto;
	}
	summary {
		cursor: pointer;
		padding-block: 0.75rem;
	}
</style>
