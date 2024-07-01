<script lang="ts">
	import Settings from './Settings.svelte';
	import { routeHistory } from '$lib/routeStore';
	import { menuController } from '@ionic/core/components';
	export let backButton = true;
	export let settings = false;

	document.addEventListener('ionBackButton', (ev: any) => {
		ev.detail.register(7, async (processNextHandler: () => {}) => {
			if (await menuController.getOpen()) {
				menuController.close();
			}
			processNextHandler();
		});
	});
</script>

<d-header back-button={backButton} {settings} backFunction={routeHistory.back}>
	<slot />
	<div slot="settings">
		<Settings />
	</div>
</d-header>
