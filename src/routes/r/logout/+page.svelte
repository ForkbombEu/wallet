<script lang="ts">
	import { goto } from '$app/navigation';
	import { removePreference } from '$lib/preferences/prefereces';

	removePreference('keyring');
	goto('/login');
</script>
<ion-tab tab="logout"/>