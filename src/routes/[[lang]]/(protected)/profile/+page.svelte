<script lang="ts">
	import { getPublicKeysFromKeypair } from '$lib/keypairoom';
	import TabPage from '$lib/tabs/TabPage.svelte';
	import { m } from '$lib/i18n';
	import { getDIDPreference } from '$lib/preferences/did';
	import type { ListParameters, ServerUrl } from '@slangroom/pocketbase';
	import { pocketbase } from '@slangroom/pocketbase';
	import { Slangroom } from '@slangroom/core';
	import { getUser } from '$lib/preferences/user';
	import { getKeypairPreference } from '$lib/preferences/keypair';
	import IconKey from '$lib/assets/IconKey.svelte';
	import { log } from '$lib/log';

	const slangroom = new Slangroom(pocketbase);

	const keys = async () => {
		const keypair = await getKeypairPreference();
		return getPublicKeysFromKeypair(keypair!);
	};

	const organizations = async (k = '1') => {
		const user = await getUser();
		const data: { pb_address: ServerUrl; list_parameters: ListParameters } = {
			pb_address: 'https://admin.signroom.io/',
			list_parameters: {
				type: 'all',
				collection: 'orgJoinRequests',
				expand: 'organization',
				requestKey: k,
				fields: null,
				sort: null,
				filter: `user.id = "${user!.id}" && status != "pending"`
			}
		};

		const script = `
    Rule unknown ignore
    Given I send pb_address 'pb_address' and create pb_client
    Given I send list_parameters 'list_parameters' and ask records and output into 'output'
    Given I have a 'string dictionary' named 'output'
    Then print data
    `;

		// @ts-ignore
		return (await slangroom.execute(script, { data })).result.output?.records;
	};

	$: (async () =>
		log('profile', await getDIDPreference(), await keys(), await organizations('2')))();
</script>

<TabPage tab="profile" title="PROFILE">
	<div class="flex flex-col items-center gap-2 pt-16 text-center">
		<d-heading size="s" class="w-full text-center">Alessandro CognomeLunghissimo</d-heading>
		{#await getDIDPreference() then did}
			<div class="flex w-full items-center justify-center gap-2">
				<IconKey />
				<d-text>{m.Public_Key()}: {did.result.didDocument.id.substring(0, 25)}</d-text>
			</div>
		{/await}

		{#await organizations() then authorizations}
			<d-heading size="xs" class="mt-16 w-full text-center">{m.Badges()}</d-heading>
			<div class="mx-auto mt-8 flex w-3/5 flex-wrap items-center justify-between gap-8">
				{#if authorizations}
					{#each authorizations as a}
						{@const org = a.expand.organization}
						<d-avatar
							src={`https://admin.signroom.io/api/files/${org.collectionId}/${org.id}/${org.avatar}`}
							alt={org.name}
							size="xl"
						/>
						<d-avatar
							src={`https://admin.signroom.io/api/files/${org.collectionId}/${org.id}/${org.avatar}`}
							alt={org.name}
							size="xl"
						/>
						<d-avatar
							src={`https://admin.signroom.io/api/files/${org.collectionId}/${org.id}/${org.avatar}`}
							alt={org.name}
							size="xl"
						/>
						<d-avatar
							src={`https://admin.signroom.io/api/files/${org.collectionId}/${org.id}/${org.avatar}`}
							alt={org.name}
							size="xl"
						/>
					{/each}
				{/if}
			</div>
		{/await}
		<d-button href="/logout" class="mt-20">{m.Logout()}</d-button>
	</div>
</TabPage>
