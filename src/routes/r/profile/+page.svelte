<script lang="ts">
	import TabPage from '$lib/components/organisms/TabPage.svelte';
</script>

<TabPage tabId="profile" title="Profile">
	<div class="flex-col gap-2">
		<ion-label>Badges:</ion-label>
		<div class="flex-row gap-2 mt-2">
			<ion-badge class="p-4" color="primary">Dyne.org</ion-badge>
			<ion-badge class="p-4" color="secondary">Forkbomb</ion-badge>
			<ion-badge class="p-4" color="tertiary">Acme</ion-badge>
		</div>
		<br />
		<ion-label>Public Key:</ion-label>
		<div class="select-all p-1 bg-slate-400 border-slate-700 border-2 rounded-md">63FaC9201494f0bd17B9892B9fae4d52fe3BD377</div>
    <ion-button href="/r/logout">Logout</ion-button>
	</div>
</TabPage>
