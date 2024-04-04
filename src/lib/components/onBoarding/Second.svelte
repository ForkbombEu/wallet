<script lang="ts">
	import { m } from '$lib/i18n';
	import background from '$lib/assets/bg-2.svg';
	import Illustration from '../molecules/Illustration.svelte';
</script>

<div class="flex flex-col gap-8">
	<div class="relative">
		<img
			src={background}
			class="max-h-[50vh] w-full fill-[var(--highlight)] opacity-50"
			alt="background"
		/>
		<Illustration img="hand-ellipsis" />
	</div>
	<div class="flex flex-col gap-4 px-4">
		<d-heading size="s">{m.Create_your_DID()}</d-heading>
		<d-text size="m"
			>{m.on_boarding_subtitle_2()}</d-text
		>
	</div>
</div>
