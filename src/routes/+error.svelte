<script>
	import { page } from '$app/stores';
	import { r } from '$lib/i18n';
</script>

<h1>{$page.status}: {$page.error?.message}</h1>
<ion-button href={r('/')}>Go to home</ion-button>
