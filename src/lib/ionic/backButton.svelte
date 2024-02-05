<script lang="ts">
	import { goto, r } from '$lib/i18n'

	export let href: string;
</script>

<ion-back-button default-href={r(href)} on:click={() => goto(href)} />
