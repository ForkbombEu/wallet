<script>
	import { page } from '$app/stores';
	import { r } from '$lib/i18n';
	import { log } from '$lib/log';
	import { onMount } from 'svelte';
	onMount(async ()=>await log(`${page.url} 
	
	${$page.status}: ${JSON.stringify($page.error)}`))
</script>

<h1>{$page.status}: {JSON.stringify($page.error)}</h1>
<d-button href={r('/')} expand>Go to home</d-button>
