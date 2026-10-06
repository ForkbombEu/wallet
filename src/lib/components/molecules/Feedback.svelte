<script lang="ts">
	import { m } from '$lib/i18n';
	export let type: 'success' | 'error' | undefined = undefined;
	export let feedback = '';
	export let message: string | undefined = undefined;
</script>

<d-feedback
	{...$$restProps}
	{type}
	{feedback}
	{message}
	close-label={m.Dismiss_message()}
	show-more-label={m.Technical_details()}
	show-less-label={m.Hide_details()}
	on:dClose
/>
