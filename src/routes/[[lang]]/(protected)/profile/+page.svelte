<script lang="ts">
	import { m } from '$lib/i18n';
	import { authFilesUri, filesUri } from '$lib/backendUri.js';
	import { scanButton } from '$lib/tabs';
	import Settings from '$lib/components/molecules/Settings.svelte';
	export let data;
	const { orgs, user, did } = data;
</script>

<d-tab-page tab="profile" title="PROFILE" {...scanButton} settings>
	<div class="flex flex-col items-center gap-2 pt-8 text-center">
		<d-avatar src={authFilesUri(user?.avatar, user?.id)} size="xl"></d-avatar>
		<d-heading size="xs" class="w-full">{user?.name || user?.email}</d-heading>
		<d-did-box did={did?.result?.didDocument.id || did?.didDocument.id}></d-did-box>
		{#if orgs.length > 0}
			<d-heading size="xs" class="mt-16 w-full text-center">{m.Badges()}</d-heading>
			<div class="mx-auto mt-8 flex w-11/12 flex-wrap items-center justify-between gap-2">
				{#each orgs as org}
					<d-avatar src={filesUri(org.avatar, org.collectionId, org.id)} alt={org.name} size="xl" />
				{/each}
			</div>
		{/if}
	</div>
	<div slot="settings">
		<Settings />
	</div>
</d-tab-page>
