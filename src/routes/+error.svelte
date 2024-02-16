<script>
	import { page } from '$app/stores';
	import { r } from '$lib/i18n';
</script>

<h1>{$page.status}: {$page.error?.message}</h1>
<d-button href={r('/')} expand>Go to home</d-button>
