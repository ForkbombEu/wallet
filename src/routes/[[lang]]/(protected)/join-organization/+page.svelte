<script lang="ts">
	import HeaderWithBackButton from '$lib/components/molecules/HeaderWithBackButton.svelte';
	import { m } from '$lib/i18n';
	import { backendUri } from '$lib/backendUri';
	import { Slangroom } from '@slangroom/core';
	import { pocketbase } from '@slangroom/pocketbase';
	import create from '$lib/slangroom/create.slang?raw';
	import { fly } from 'svelte/transition';

	export let data;
	const { organizations, user } = data;
	const expandOrgJoinReq = 'orgJoinRequests_via_organization';
	const expandOrgAuth = 'orgAuthorizations_via_organization';
	let isModalOpen = false;

	const sendJoinRequest = async (org: Record<string, any>) => {
		const slangroom = new Slangroom(pocketbase);
		const data = {
			pb_address: backendUri,
			create_parameters: {
				collection: 'orgJoinRequests',
				record: {
					organization: org.id,
					user: user!.id,
					status: 'pending',
					reminders: 0
				},
				record_parameters: {}
			},
			record_parameters: {}
		};
		await slangroom.execute(create, { data });
	};
</script>

<HeaderWithBackButton>User Settings</HeaderWithBackButton>

<div class="ion-padding flex w-full flex-col gap-6">
	<d-vertical-stack>
		<d-heading size="xs" class="w-full">{'join an organization'}</d-heading>
		<d-heading size="xs" class="w-full">{'piripicchio'}</d-heading>
	</d-vertical-stack>
	<hr />
	<d-vertical-stack gap={4} class="h-full overflow-scroll bg-highlight p-4 pb-24">
		{#each organizations as org}
			{@const avatarUrl = 'pb.files.getUrl(org, org.avatar)'}
			{@const hasDescription = Boolean(org.description)}
			{@const sentMembershipRequest = org.expand?.[expandOrgJoinReq]?.at(0)}
			{@const orgAuthorization = org.expand?.[expandOrgAuth]?.at(0)}

			{#if orgAuthorization}
				<div class="flex items-center gap-2 rounded-lg border-2 border-accent bg-surface p-4">
					<d-avatar src={avatarUrl} size="m" class="shrink-0" shape="square"/>
					<div>
						<d-heading size="s">{org.name}</d-heading>
						{#if hasDescription}
							<d-text>
								<span class="line-clamp-2">
									{@html org.description}
								</span>
							</d-text>
						{/if}
					</div>
					<d-button
						color="accent"
						on:click={() => {
							isModalOpen = true;
						}}
						aria-hidden
					>
						{'Join'}
					</d-button>
					<ion-modal is-open={isModalOpen} backdrop-dismiss={false} transition:fly class="visible">
						<d-vertical-stack gap={4}>
							<d-heading size="s">{'Send_a_request_to'} {org.name}</d-heading>
							<d-text>{'Please_confirm_that_you_want_to_join_this_organization_'}</d-text>
							<d-horizontal-stack gap={4}>
								<d-button on:click={() => (isModalOpen = false)} aria-hidden>
									{'Cancel'}
								</d-button>
								<d-button
									color="accent"
									on:click={() => sendJoinRequest(org).then(() => (isModalOpen = false))}
									aria-hidden
								>
									{'Send_join_request'}
								</d-button>
							</d-horizontal-stack>
						</d-vertical-stack>
					</ion-modal>
				</div>
				<div slot="right" class="shrink-0 self-start pl-8">
					{#if !sentMembershipRequest}
						ppp
					{:else}
						<d-button color="alternative" disabled>{'Request_sent'}</d-button>
					{/if}
				</div>
			{/if}
		{/each}
	</d-vertical-stack>
</div>
