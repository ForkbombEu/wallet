<script lang="ts">
	import type { Tab } from '.';

	export let tab: Tab;
	export let title: string | undefined = undefined;
</script>

<ion-tab {tab}>
	{#if title}
		<ion-header>
			<ion-toolbar>
				<ion-title>
					{title}
				</ion-title>
			</ion-toolbar>
		</ion-header>
	{/if}

	<ion-content fullscreen>
		<slot />
	</ion-content>
</ion-tab>
