<script lang="ts">
	import { m } from '$lib/i18n';
	import { authFilesUri, filesUri } from '$lib/backendUri.js';
	import { scanButton } from '$lib/tabs';
	import Settings from '$lib/components/molecules/Settings.svelte';
	export let data;
	const { orgs, user, did } = data;
</script>

<d-tab-page tab="profile" title="PROFILE" {...scanButton} settings>
	<div class="flex h-full flex-col gap-24 justify-between">
		<div class="flex flex-col items-center pt-8 gap-2 text-center">
			<d-avatar src={authFilesUri(user?.avatar, user?.id)} size="xl"></d-avatar>
			<d-heading size="xs" class="w-full">{user?.name || user?.email}</d-heading>
			<d-did-box did={did?.result?.didDocument.id || did?.didDocument.id}></d-did-box>
		</div>
		<d-organizations heading={m.Badges()} empty={(orgs.length == 0)}>
			{#each orgs as org}
				<d-avatar src={filesUri(org.avatar, org.collectionId, org.id)} alt={org.name} size="xl" />
			{/each}
		</d-organizations>
	</div>
	<div slot="settings">
		<Settings />
	</div>
</d-tab-page>
