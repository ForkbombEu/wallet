<script lang="ts">
	import { goto } from '$lib/i18n';
	import { dev } from '$lib/log';

	let clicked: number = 0;
	const clicksNeeded = 5;
	const onClick = () => {
		clicked++;
		if (clicked === clicksNeeded) {
			clicked = 0;
			goto('/logs');
		}
	};
</script>

{#if dev}
	<button on:click={onClick} class="absolute left-1/2 top-0 z-50 h-6 w-20"></button>
{/if}
