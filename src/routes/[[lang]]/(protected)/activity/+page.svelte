<script lang="ts">
	import TabPage from '$lib/tabs/TabPage.svelte';
	import { faker } from '@faker-js/faker';
	import { m } from '$lib/i18n';
</script>

<TabPage tab="activity" title="ACTIVITY">
	<ion-list>
		<ion-list-header>{m.Recent_Conversations()}</ion-list-header>
		{#each Array(10) as _}
			<ion-item>
				<ion-avatar slot="start">
					<img alt="avatar" src={`https://i.pravatar.cc/40?u=${faker.person.firstName()}`} />
				</ion-avatar>

				<ion-label>
					<h2>{faker.person.fullName()}</h2>

					<h3>{faker.lorem.sentence()}</h3>

					<p>{faker.lorem.paragraph()}</p>
				</ion-label>
			</ion-item>
		{/each}
	</ion-list>
</TabPage>
