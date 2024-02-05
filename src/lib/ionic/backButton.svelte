<script lang="ts">
	import { goto } from '$lib/i18n'

	export let href: string;
</script>

<ion-back-button default-href={href} on:click={() => goto(href)} />
