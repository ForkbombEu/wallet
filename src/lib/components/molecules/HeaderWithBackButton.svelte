<script lang="ts">
	import { m } from '$lib/i18n';
</script>

<d-header back-button back-button-label={m.back()} on:backButtonClick={() => window.history.back()}>
	<slot />
</d-header>
