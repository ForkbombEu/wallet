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

	const slangroom = new Slangroom(pocketbase);

	const keys = async () => {
		const keypair = await getKeypairPreference();
		return getPublicKeysFromKeypair(keypair!);
	};

	const organizations = async () => {
		const user = await getUser();
		const data: { pb_address: ServerUrl; list_parameters: ListParameters } = {
			pb_address: 'https://admin.signroom.io/',
			list_parameters: {
				type: 'all',
				collection: 'orgJoinRequests',
				expand: null,
				requestKey: null,
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

		return await slangroom.execute(script, { data });
	};
</script>

<TabPage tab="profile" title="PROFILE">
	<div class="flex-col gap-2">
		<ion-label>{m.Badges()}</ion-label>
		<div class="mt-2 flex-row gap-2">
			<ion-badge class="p-4" color="primary">Dyne.org</ion-badge>
			<ion-badge class="p-4" color="secondary">Forkbomb</ion-badge>
			<ion-badge class="p-4" color="tertiary">Acme</ion-badge>
		</div>
		<br />
		<ion-label>{m.Public_Key()}</ion-label>
		<div class="select-all rounded-md border-2 border-slate-700 bg-slate-400 p-1">
			63FaC9201494f0bd17B9892B9fae4d52fe3BD377
		</div>
		<d-button href="/logout">{m.Logout()}</d-button>

		{#await getDIDPreference() then did}
			<div>
				<p>DID</p>
				<pre>{JSON.stringify(did, null, 2)}</pre>
			</div>
		{/await}
		{#await organizations() then result}
			<div>
				<p>Organizations</p>
				<pre>{JSON.stringify(result, null, 2)}</pre>
			</div>
		{/await}
		{#await keys() then result}
			<div>
				<p>Keys</p>
				<pre>{JSON.stringify(result, null, 2)}</pre>
			</div>
		{/await}
	</div>
</TabPage>
