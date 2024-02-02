<script lang="ts">
	export let name: string | undefined = undefined;
	export let message: string | undefined = undefined;
</script>

{#if name || message}
	<ion-card color="danger" class="m-0 -space-y-2">
		{#if name}
			<ion-card-header>
				<ion-card-title>{name}</ion-card-title>
			</ion-card-header>
		{/if}
		{#if message}
			<ion-card-content> {message} </ion-card-content>
		{/if}
	</ion-card>
{/if}
