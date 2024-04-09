<script lang="ts">
	import TabPage from '$lib/tabs/TabPage.svelte';
	import { m } from '$lib/i18n';
	import { log } from '$lib/log.js';
	import { parse } from 'did-resolver';

	export let data;

	const { orgs, user, did } = data;
	//@ts-ignore
	const { method, id: fullId } = parse(did.result?.didDocument.id || did.didDocument.id)!;
	const [submethod, id] = fullId.split(':');
</script>

<TabPage tab="profile" title="PROFILE" settings>
	<div class="flex flex-col items-center gap-2 pt-8 text-center">
		<d-avatar name={user?.name || user?.email} src={user?.logo} size="xl"></d-avatar>
		<d-heading size="s" class="w-full">{user?.name || user?.email}</d-heading>
		<d-text size="s" class="w-full"
			><span>did</span>
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
			<div class="mx-auto mt-8 flex w-4/5 flex-wrap items-center justify-between gap-2">
				{#each orgs as org}
					<d-avatar
						src={`https://admin.didroom.com/api/files/${org.collectionId}/${org.id}/${org.avatar}`}
						alt={org.name}
						size="xl"
					/>
				{/each}
			</div>
		{/if}
		<d-button href="/logout" class="mt-20 w-full" color="outline" expand>Logout</d-button>
	</div>
</TabPage>
