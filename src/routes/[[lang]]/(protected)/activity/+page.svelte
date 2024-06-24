<script lang="ts">
	import TabPage from '$lib/tabs/TabPage.svelte';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import {
		removeActivities,
		clearActivities,
		type Activity,
		setActivityAsRead
	} from '$lib/preferences/activity';
	import { r, m } from '$lib/i18n';
	import { log } from '$lib/log.js';
	import { invalidate } from '$app/navigation';
	import { _activityKey } from './+page.js';
	import Bell from '$lib/assets/bell.svelte';
	import { _protectedLayoutKey } from '../+layout.js';
	import { onDestroy } from 'svelte';

	dayjs.extend(relativeTime);

	export let data;
	let { activities, credentials } = data;
	let setReaded = false;

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

	function setAsRead(e) {
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				setTimeout(async () => {
					if (activities.find((a)=>a.at === Number(e.id))?.read) return
					await setActivityAsRead(Number(e.id))
					setReaded = true
				}, 2000)

			}
		});
		observer.observe(e);
	}

	onDestroy(() => {
		if (setReaded) {
			invalidate(_protectedLayoutKey);
		}
	});
</script>

<TabPage tab="activity" title="ACTIVITY">
	<!-- action clear all activity -->

	<div class="flex flex-col">
		{#if activities.length > 0}
			<div class="flex justify-end gap-2.5 pb-4">
				<d-button size="small" color="accent" onClick={clear}> {m.clear_all()} </d-button>
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
					<div
						class={`itens-start border-stroke flex gap-4 rounded-lg border-y p-2 ${activity.read ? '' : 'bg-primary'}`}
						use:setAsRead
						id={String(activity.at)}
					>
						<d-avatar src={credential.logo} name={credential.display_name} shape="square" />
						<div class="flex flex-col gap-2">
							<h2>{credential.issuer} {m.issued()} {credential.display_name} {m.to_you()}</h2>
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
									{m.remove()}
								</d-button>
								<d-button
									size="small"
									color="primary"
									href={r(`/${activity.id}/credential-detail`)}
								>
									{m.show_me()}
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
					<div
						class={`itens-start border-stroke flex gap-4 rounded-lg border-y p-2 ${activity.read ? '' : 'bg-primary'}`}
						use:setAsRead
						id={String(activity.at)}
					>
						<d-avatar src={credential.logo} name={credential.display_name} shape="square" />
						<div class="flex flex-col gap-2">
							<h2>{credential.display_name} {m.is_expired()}</h2>
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
									{m.remove()}
								</d-button>
								<d-button
									size="small"
									color="primary"
									href={r(`/${activity.id}/credential-detail`)}
								>
									{m.show_me()}
								</d-button>
							</div>
						</div>
					</div>
				{/if}
			{:else if activity.type === 'verification'}
				{@const { verifier_name, success, rp_name, sid, properties } = activity}
				<div
					class={`itens-start border-stroke flex gap-4 rounded-lg border-y p-2 ${activity.read ? '' : 'bg-primary'}`}
					use:setAsRead
					id={String(activity.at)}
				>
					<d-avatar name={verifier_name} shape="square" />
					<div class="flex flex-col gap-2">
						<h2>
							{verifier_name} {m.verified_yours()} {#each properties as property}
								{property},{' '}
							{/each}{m.via()} {rp_name} {m.and_it_was_a()} {success ? 'success' : 'failure'}
						</h2>
						<d-text size="s" class="text-on-alt">{m.session_id()} {sid}</d-text>
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
								{m.remove()}
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
				<d-heading size="s">{m.No_activity_yet()}</d-heading>
				<d-text size="l" class="pb-4 text-center"
					>{m.Get_alerts_on_new_activities_and_keep_your_account_uptodate_()}</d-text
				>
			</div>
		{/each}
	</div>
</TabPage>
