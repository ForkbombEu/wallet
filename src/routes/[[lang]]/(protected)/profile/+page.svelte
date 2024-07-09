<script lang="ts">
	import { m } from '$lib/i18n';
	import { parse } from 'did-resolver';
	import { authFilesUri, filesUri } from '$lib/backendUri.js';
	import AppDetails from '$lib/components/AppDetails.svelte';
	import { scanButton } from '$lib/tabs';
	import Settings from '$lib/components/molecules/Settings.svelte';
	import Key from '$lib/assets/Key.svelte';

	export let data;

	const { orgs, user, did } = data;
	//@ts-expect-error did needs to be typed
	const { method, id: fullId } = parse(did?.result?.didDocument.id || did?.didDocument.id)!;
	const [submethod, id] = fullId.split(':');
</script>

<d-tab-page tab="profile" title="PROFILE" {...scanButton} settings>
	<div class="flex flex-col items-center gap-2 pt-8 text-center">
		<d-avatar src={authFilesUri(user?.avatar, user?.id)} size="xl"></d-avatar>
		<d-heading size="xs" class="w-full">{user?.name || user?.email}</d-heading>
		<div class="flex items-center gap-2">

			<d-text size="s" class="text-gray">
				<a class="flex" href={`https://explorer.did.dyne.org/details/did:${fullId}`}
					><d-text size="s" class="w-full flex justify-center flex-wrap space-y-0.5"
						>
						<span class="w-5 h-5 flex mr-1"><Key /></span>
						<span>{'did'}</span>
						<span class="text-gray-400">:</span>
						<span class="text-warning">{method}</span>
						<span class="text-gray-400">:</span>
						<span class="text-on-alt">{submethod}</span>
						<span class="text-gray-400">:</span>
						<br />
						<span>{id}</span></d-text
					></a
				>
			</d-text>
		</div>

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
