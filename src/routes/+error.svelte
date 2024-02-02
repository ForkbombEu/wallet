<script>
	import { page } from '$app/stores';
</script>

<h1>{$page.status}: {$page.error?.message}</h1>
<ion-button href="/">Go to home</ion-button>
