<script lang="ts">
	export let data: any;
	const { credential } = data;
</script>

<ion-header>
	<ion-toolbar>
		<ion-title>CREDENTIAL DETAIL</ion-title>
	</ion-toolbar>
</ion-header>
<ion-content fullscreen class="ion-padding">
	<d-credential-card {...credential} />
	<div class="bg-tab fixed bottom-0 left-0 w-full">
		<d-credential-detail {...credential}>
			<div class="mb-2">
				{#if credential.id.length < 3}
					<d-button color="accent" href="/scan">Verify credential</d-button>
				{:else}
					<d-button color="accent" href={`/${credential.id}/credential-offer`}
						>Get this credential</d-button
					>
				{/if}
			</div>
		</d-credential-detail>
	</div>
</ion-content>
