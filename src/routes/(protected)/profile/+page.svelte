<script lang="ts">
	import TabPage from '$lib/tabs/TabPage.svelte';
</script>

<TabPage tab="profile" title="PROFILE">
	<div class="flex-col gap-2">
		<ion-label>Badges:</ion-label>
		<div class="mt-2 flex-row gap-2">
			<ion-badge class="p-4" color="primary">Dyne.org</ion-badge>
			<ion-badge class="p-4" color="secondary">Forkbomb</ion-badge>
			<ion-badge class="p-4" color="tertiary">Acme</ion-badge>
		</div>
		<br />
		<ion-label>Public Key:</ion-label>
		<div class="select-all rounded-md border-2 border-slate-700 bg-slate-400 p-1">
			63FaC9201494f0bd17B9892B9fae4d52fe3BD377
		</div>
		<ion-button href="/logout">Logout</ion-button>
	</div>
</TabPage>
