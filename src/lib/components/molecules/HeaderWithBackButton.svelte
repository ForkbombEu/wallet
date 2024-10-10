<script lang="ts">
	import { goto } from "$lib/i18n";

	export let lockOnBackButton = false;
	const back = () => {
		if (lockOnBackButton) {
			 goto('/unlock');
		} else {
			window.history.back();
		}
	};
</script>
<d-header back-button on:backButtonClick={back}>
	<slot />
</d-header>
