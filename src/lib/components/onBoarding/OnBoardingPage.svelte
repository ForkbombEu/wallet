<script lang="ts">
	import Illustration from '../molecules/Illustration.svelte';

	export let title: string;
	export let subtitle: string | undefined = undefined;
	export let description: string;
	export let background: string;
</script>

<swiper-slide class="h-full">
	<div class="flex flex-col justify-between">
		<Illustration {background}>
			<slot />
		</Illustration>
		<div class="flex flex-col gap-4 px-4">
			<d-heading size="s">{title},</d-heading>
			{#if subtitle}<d-text size="xl" class="pb-4">{subtitle}</d-text>{/if}
			<d-text size="m">{description}</d-text>
		</div>
	</div>
</swiper-slide>
