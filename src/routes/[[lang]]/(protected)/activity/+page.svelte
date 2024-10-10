<script lang="ts">
	import {
		removeActivities,
		clearActivities,
		setActivityAsRead,
		setAllActivitiesAsRead
	} from '$lib/preferences/activity';
	import { r, m } from '$lib/i18n';
	import { invalidate } from '$app/navigation';
	import { _activityKey } from './+page.js';
	import Bell from '$lib/assets/bell.svelte';
	import { _protectedLayoutKey } from '../+layout.js';
	import { scanButton } from '$lib/tabs';

	export let data;
	let { activities } = data;

	let hasChangesFlag = false;

	const cancelActivity = async (at: number) => {
		await removeActivities([at]);
		await invalidate(_activityKey);
		activities = data.activities;
	};

	const clear = async () => {
		await clearActivities();
		await invalidate(_activityKey);
		activities = data.activities;
	};

	function setAsRead(e: Element) {
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				setTimeout(async () => {
					if (activities.find((a) => a.at === Number(e.id))?.read) return;
					await setActivityAsRead(Number(e.id));
					hasChangesFlag = true;
				}, 2000);
			}
		});
		observer.observe(e);
	}

	const setAllRead = async () => {
		await setAllActivitiesAsRead();
		hasChangesFlag = true;
	};
	const reloadActivities = async () => {
		await invalidate(_protectedLayoutKey);
		await invalidate(_activityKey);
		activities = data.activities;
	};
	$: if (hasChangesFlag) reloadActivities();
</script>

<d-tab-page tab="activity" title={m.Notifications()} {...scanButton}>
	<div class="flex w-full flex-col items-center">
		{#if activities.length > 0}
			<div class="flex w-full justify-end gap-2.5 pb-4">
				<d-button size="small" color="accent" onClick={clear}> {m.clear_all()} </d-button>
				<d-button size="small" color="primary" onClick={setAllRead}>
					{m.mark_all_as_read()}
				</d-button>
			</div>
		{/if}
		{#each activities as activity}
			<d-activity-card
				{...activity}
				logo={activity.logo.url}
				id={String(activity.at)}
				use:setAsRead
			>
				<d-button
					size="small"
					color="accent"
					onClick={async () => await cancelActivity(activity.at)}
				>
					{m.remove()}
				</d-button>
				{#if activity.credential}
					<d-button
						size="small"
						color="primary"
						href={r(`/${activity.credential.id}/credential-detail`)}
					>
						{m.show_me()}
					</d-button>
				{/if}
			</d-activity-card>
		{:else}
			<d-empty-state
				heading={m.No_activity_yet()}
				text={m.Get_alerts_on_new_activities_and_keep_your_account_uptodate_()}
			>
				<Bell />
			</d-empty-state>
		{/each}
	</div>
</d-tab-page>
