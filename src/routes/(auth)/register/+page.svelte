<script lang="ts">
	import Questions from '$lib/keypairoomForms/QuestionsForm.svelte';
</script>

<ion-header translucent={true}>
	<ion-toolbar>
		<ion-buttons slot="start">
			<ion-menu-button />
		</ion-buttons>
		<ion-title>Authenticate</ion-title>
	</ion-toolbar>
</ion-header>

<ion-content fullscreen class="ion-padding">
	<Questions />
</ion-content>
