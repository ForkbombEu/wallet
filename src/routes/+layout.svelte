<script lang="ts">
	import { setupIonicBase } from 'ionic-svelte';

	setupIonicBase();

	import '@fontsource/poppins';
	import 'ionic-svelte/components/all';
	import '../theme/variables.css';
</script>

<ion-app>
	<slot />
</ion-app>
