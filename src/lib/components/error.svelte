<script lang="ts">
	export let name: string | undefined = undefined;
	export let message: string | undefined = undefined;
</script>

{#if name}
	<ion-text color="danger">
		<h3 class="text-lg">
			{name}
		</h3>
	</ion-text>
{/if}
{#if message}
	<p>
		<ion-text color="danger">
			{message}
		</ion-text>
	</p>
{/if}
