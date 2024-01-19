<script lang="ts">
	import { goto } from '$app/navigation';

	export let href: string;
</script>

<ion-back-button default-href={href} on:click={() => goto(href)} />
