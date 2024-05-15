<script lang="ts">
	import TabPage from '$lib/tabs/TabPage.svelte';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { removeActivities, clearActivities } from '$lib/preferences/activity';
	import { r } from '$lib/i18n';
	import { log } from '$lib/log.js';

	dayjs.extend(relativeTime);

	export let data;
	const { activities, credentials } = data;
</script>

<TabPage tab="activity" title="ACTIVITY">
	<div class="flex fllex-col">
		{#if !activities}
			empty state
		{:else}
			{#each activities as activity}
				{#if activity.type === 'credential'}
					{@const credential = credentials?.find((cred) => cred.id === activity.id)}
					{#if !credential}
						{log(`credential ${activity.id} not found`)}
					{:else}
						<div class="flex itens-start border-strocke border-b py-2 gap-4">
							<d-avatar
								src={credential.logo}
								name={credential.display_name}
								shape="square"
							/>
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
										onClick={() => removeActivities([activity.at])}
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
				{:else}
					pp
				{/if}
			{/each}
			<!-- <ion-item class="border-b border-strocke">
		<d-avatar src={''} size="xl" slot="start"/>

				<ion-avatar slot="start">
					<img alt="avatar" src={`https://i.pravatar.cc/40?u=${faker.person.firstName()}`} name={}/>
				</ion-avatar>

				<ion-label>
					<h2>{faker.person.fullName()}</h2>

					<h3>{faker.lorem.sentence()}</h3>

					<p>{faker.lorem.paragraph()}</p>
				</ion-label>
			</ion-item> -->
		{/if}
	</div>
</TabPage>
