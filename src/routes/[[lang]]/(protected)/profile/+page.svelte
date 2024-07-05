<script lang="ts">
	import TabPage from '$lib/tabs/TabPage.svelte';
	import { m } from '$lib/i18n';
	import { parse } from 'did-resolver';
	import { authFilesUri, filesUri } from '$lib/backendUri.js';
	import AppDetails from '$lib/components/AppDetails.svelte';

	export let data;

	const { orgs, user, did } = data;
	//@ts-expect-error did needs to be typed
	const { method, id: fullId } = parse(did?.result?.didDocument.id || did?.didDocument.id)!;
	const [submethod, id] = fullId.split(':');
	$: console.log(authFilesUri(user?.avatar, user?.id))
</script>

<d-tab-page tab="profile" title="PROFILE" settings>
	<div class="flex flex-col items-center gap-2 pt-8 text-center">
		<d-avatar src={authFilesUri(user?.avatar, user?.id)} size="xl"></d-avatar>
		<d-heading size="s" class="w-full">{user?.name || user?.email}</d-heading>
		<d-text size="s" class="w-full"
			><span>{'did'}</span>
			<span class="text-gray-400">:</span>
			<span class="text-warning">{method}</span>
			<span class="text-gray-400">:</span>
			<span class="text-on-alt">{submethod}</span>
			<span class="text-gray-400">:</span>
			<br />
			<span>{id}</span></d-text
		>

		{#if orgs.length > 0}
			<d-heading size="xs" class="mt-16 w-full text-center">{m.Badges()}</d-heading>
			<div class="mx-auto mt-8 flex w-11/12 flex-wrap items-center justify-between gap-2">
				{#each orgs as org}
					<d-avatar src={filesUri(org.avatar, org.collectionId, org.id)} alt={org.name}  size="xl" />
				{/each}
			</div>
		{/if}
		<AppDetails />
	</div>
</d-tab-page>
