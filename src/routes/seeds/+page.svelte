<script lang="ts">
	import Seeds from "$lib/keypairoom/Seeds.svelte";

</script>

<ion-header translucent={true}>
	<ion-toolbar>
		<ion-buttons slot="start">
			<ion-menu-button />
		</ion-buttons>
		<ion-title>Login</ion-title>
	</ion-toolbar>
</ion-header>

<ion-content fullscreen class="ion-padding">
	<Seeds/>
</ion-content>
