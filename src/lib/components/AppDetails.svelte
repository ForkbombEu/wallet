<script lang="ts">
	import { version } from '$app/environment';
	import { m } from '$lib/i18n';
</script>

<div class="flex flex-col items-center gap-2 p-6">
	<d-text size="l">{m.Developed_by_Forkbomb_BV()}</d-text>
	<d-text size="m">v {version}</d-text>
</div>
