<script>
	import { page } from '$app/stores';
	import { r, m } from '$lib/i18n';
	import { log } from '$lib/log';
	import { onMount } from 'svelte';
	onMount(
		async () =>
			await log(`${page.url} 
	
	${$page.status}: ${JSON.stringify($page.error)}`)
	);
</script>

<h1>{$page.status}: {JSON.stringify($page.error)}</h1>
<d-button href={r('/')} expand>{m.Go_to_home()}</d-button>
