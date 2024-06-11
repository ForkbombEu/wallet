<script lang="ts">
	import TabPage from '$lib/tabs/TabPage.svelte';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { removeActivities, clearActivities, type Activity } from '$lib/preferences/activity';
	import { r } from '$lib/i18n';
	import { log } from '$lib/log.js';
	import { invalidate } from '$app/navigation';
	import { _activityKey } from './+page.js';
	import Bell from '$lib/assets/bell.svelte';

	dayjs.extend(relativeTime);

	export let data;
	let { activities, credentials } = data;

	const cancelActivity = async (activity: Activity) => {
		await removeActivities([activity.at]);
		await invalidate(_activityKey);
		activities = data.activities;
	};

	const clear = async () => {
		await clearActivities();
		await invalidate(_activityKey);
		activities = data.activities;
	};
</script>

<TabPage tab="activity" title="ACTIVITY">
	<!-- action clear all activity -->

	<div class="flex flex-col">
		{#if activities.length > 0}
			<div class="flex justify-end gap-2.5 pb-4">
				<d-button size="small" color="accent" onClick={clear}> clear all </d-button>
			</div>
		{/if}
		{#each activities.reverse() as activity}
			{#if activity.type === 'credential'}
				{@const credential = credentials?.find((cred) => cred.id === activity.id)}
				{#if !credential}
					<div class="hidden">
						{log(`credential ${activity.id} not found`)}
					</div>
				{:else}
					<div class="itens-start border-strocke flex gap-4 border-b py-2">
						<d-avatar src={credential.logo} name={credential.display_name} shape="square" />
						<div class="flex flex-col gap-2">
							<h2>{credential.issuer} issued {credential.display_name} to you</h2>
							<d-text size="s" class="text-on-alt">{credential.description}</d-text>
							<div class="flex items-center gap-2.5">
								<d-info-led type="warning" />
								<d-text size="xs">{dayjs().to(dayjs.unix(activity.at))}</d-text>
							</div>
							<!-- actions: cancel, goto -->
							<div class="flex justify-end gap-2.5">
								<d-button
									size="small"
									color="accent"
									onClick={async () => await cancelActivity(activity)}
								>
									remove
								</d-button>
								<d-button
									size="small"
									color="primary"
									href={r(`/${activity.id}/credential-detail`)}
								>
									show me!
								</d-button>
							</div>
						</div>
					</div>
				{/if}
			{:else if activity.type === 'expired'}
				{@const credential = credentials?.find((cred) => cred.id === activity.id)}
				{#if !credential}
					<div class="hidden">
						{log(`credential ${activity.id} not found`)}
					</div>
				{:else}
					<div class="itens-start border-strocke flex gap-4 border-b py-2">
						<d-avatar src={credential.logo} name={credential.display_name} shape="square" />
						<div class="flex flex-col gap-2">
							<h2>{credential.display_name} is expired</h2>
							<d-text size="s" class="text-on-alt">{credential.description}</d-text>
							<div class="flex items-center gap-2.5">
								<d-info-led type="error" />
								<d-text size="xs">{dayjs().to(dayjs.unix(activity.at))}</d-text>
							</div>
							<!-- actions: cancel, goto -->
							<div class="flex justify-end gap-2.5">
								<d-button
									size="small"
									color="accent"
									onClick={async () => await cancelActivity(activity)}
								>
									remove
								</d-button>
								<d-button
									size="small"
									color="primary"
									href={r(`/${activity.id}/credential-detail`)}
								>
									show me!
								</d-button>
							</div>
						</div>
					</div>
				{/if}
			{:else if activity.type === 'verification'}
				{@const { verifier_name, success, rp_name, sid, properties } = activity}
				<div class="itens-start border-strocke flex gap-4 border-b py-2">
					<d-avatar name={verifier_name} shape="square" />
					<div class="flex flex-col gap-2">
						<h2>
							{verifier_name} verified yours: {#each properties as property}
								{property},{' '}
							{/each}via {rp_name} and it was a {success ? 'success' : 'failure'}
						</h2>
						<d-text size="s" class="text-on-alt">session id: {sid}</d-text>
						<div class="flex items-center gap-2.5">
							<d-info-led type="warning" />
							<d-text size="xs">{dayjs().to(dayjs.unix(activity.at))}</d-text>
						</div>
						<div class="flex justify-end gap-2.5">
							<d-button
								size="small"
								color="accent"
								onClick={async () => await cancelActivity(activity)}
							>
								remove
							</d-button>
						</div>
					</div>
				</div>
			{/if}
		{:else}
			<div class="flex h-3/5 flex-col items-center justify-center gap-1">
				<div>
					<Bell />
				</div>
				<d-heading size="s">No activity yet</d-heading>
				<d-text size="l" class="pb-4 text-center"
					>Get alerts on new activities and keep your account up-to-date.</d-text
				>
			</div>
		{/each}
	</div>
</TabPage>
