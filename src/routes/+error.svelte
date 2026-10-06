<script lang="ts">
	import { page } from '$app/stores';
	import { r, m } from '$lib/i18n';
	import { log } from '$lib/log';
	import { onMount } from 'svelte';
	onMount(() => {
		void log(`${$page.status}: ${String($page.error?.message || '')}`);
	});
</script>

<ion-content class="ion-padding">
	<div class="auth-task">
		<d-heading size="s" level={1}>{m.Page_unavailable()}</d-heading>
		<d-text>{m.Page_unavailable_help()}</d-text>
		<d-button on:click={() => window.history.back()} expand color="accent">{m.back()}</d-button>
		<d-button href={r('/')} expand>{m.Go_to_home()}</d-button>
		<d-button href="https://didroom.com/guides/support.html" clear color="accent" expand
			>{m.Support()}</d-button
		>
	</div>
</ion-content>
