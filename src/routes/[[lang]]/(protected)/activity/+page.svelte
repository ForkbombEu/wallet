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
	import type { Credential } from '$lib/preferences/credentials';
	import { r, m } from '$lib/i18n';
	import { invalidate } from '$app/navigation';
	import { _activityKey } from './+page.js';
	import Bell from '$lib/assets/bell.svelte';
	import { _protectedLayoutKey } from '../+layout.js';
	import { onDestroy } from 'svelte';

	dayjs.extend(relativeTime);

	export let data;
	let { activities, credentials } = data;
	let setReaded = false;

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
					setReaded = true;
				}, 2000);
			}
		});
		observer.observe(e);
	}

	onDestroy(() => {
		if (setReaded) {
			invalidate(_protectedLayoutKey);
		}
	});

	type ParsedActivity = {
		name: string;
		logo: { url: string; alt_text: string };
		description: string;
		date: string;
		message: string;
		cardType: string;
		credential?: Credential;
		read?: boolean;
		at: number;
	};

	function parseActivities(activities: Activity[], credentials?: Credential[]): ParsedActivity[] {
		function findCredentialById(id: number) {
			return credentials?.find((cred) => cred.id === id);
		}

		function formatActivity(activity: Activity) {
			let parsedActivity: ParsedActivity = {
				name: '',
				logo: { url: '', alt_text: '' },
				description: '',
				date: '',
				message: '',
				cardType: '',
				at: 0
			};
			parsedActivity.date = dayjs().to(dayjs.unix(activity.at));

			if (activity.type === 'credential' || activity.type === 'expired') {
				const credential = findCredentialById(activity.id);
				if (!credential) {
					console.log(`credential ${activity.id} not found`);
					return;
				}
				parsedActivity.name = credential.display_name;
				parsedActivity.logo = credential.logo;
				parsedActivity.description = credential.description;
				parsedActivity.credential = credential;
				if (activity.type === 'credential') {
					parsedActivity.message = `${credential.issuer} issued ${credential.display_name} to you`;
					parsedActivity.cardType = 'warning';
				} else {
					parsedActivity.message = `${credential.display_name} is expired`;
					parsedActivity.cardType = 'error';
				}
			} else if (activity.type === 'verification') {
				const { verifier_name, success, rp_name, properties } = activity;
				parsedActivity.message = `${verifier_name} verified yours: ${properties.join(', ')} via ${rp_name} and it was a ${
					success ? 'success' : 'failure'
				}`;
				parsedActivity.cardType = 'warning';
			}
			return parsedActivity;
		}

		return activities
			.reverse()
			.map(formatActivity)
			.filter((activity): activity is ParsedActivity => Boolean(activity));
	}

	console.log(parseActivities(activities, credentials));
</script>

<TabPage tab="activity" title="ACTIVITY">
	<div class="flex flex-col">
		{#if activities.length > 0}
			<div class="flex justify-end gap-2.5 pb-4">
				<d-button size="small" color="accent" onClick={clear}> {m.clear_all()} </d-button>
			</div>
		{/if}
		{#each parseActivities(activities, credentials) as activity}
			<d-activity-card
				name={activity.name}
				logo={activity.logo}
				description={activity.description}
				date={dayjs().to(dayjs.unix(activity.at))}
				type={activity.cardType}
				read={activity.read}
				message={activity.message}
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
</TabPage>
