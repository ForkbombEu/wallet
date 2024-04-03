<script lang="ts">
	import { m } from '$lib/i18n';
	import Illustration from '../molecules/Illustration.svelte';
	import background from '$lib/assets/bg-3.svg';
</script>

<div class="flex flex-col gap-8">
	<div class="relative">
		<img
			src={background}
			class="max-h-[50vh] w-full fill-[var(--highlight)] opacity-50"
			alt="background"
		/>
		<Illustration img="hand-card" />
	</div>
	<div class="flex flex-col gap-4 px-4">
		<d-heading size="s">{m.Manage_VC_verifiable_credentials_in_one_place()}</d-heading>
		<d-text size="m"
			>{m.on_boarding_subtitle_3()}</d-text
		>
	</div>
</div>
