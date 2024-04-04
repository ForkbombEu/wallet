<script lang="ts">
	import { m } from '$lib/i18n';
	import background from '$lib/assets/bg-1.svg';
	import Illustration from '../molecules/Illustration.svelte';
</script>

<div class="flex flex-col justify-between">
	<div>
		<div class="flex flex-col gap-2" />
		<div>
			<img
				src={background}
				class="max-h-[50vh] w-full shrink-0 fill-highlight opacity-50"
				alt="background"
			/>
			<Illustration img="logo-hand" />
		</div>
		<div class="flex flex-col gap-4 px-4">
			<d-heading size="s">{m.Welcome_to_DID_Wallet()},</d-heading>
			<d-text size="xl" class="pb-4">{m.your_friendly_and_trustable_opensource_wallet_()}</d-text>
			<d-text size="m"
				>{m.on_boarding_subtitle_1()}</d-text
			>
		</div>
	</div>
</div>
