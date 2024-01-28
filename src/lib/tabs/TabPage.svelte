<script lang="ts">
	import type { Tab } from '.';

	export let tab: Tab;
	export let title: string;
</script>

<ion-tab {tab}>
	<ion-header>
		<ion-toolbar>
			<ion-title>{title}</ion-title>
		</ion-toolbar>
	</ion-header>

	<ion-content fullscreen>
		<div class="p-4">
			<slot />
		</div>
	</ion-content>
</ion-tab>
