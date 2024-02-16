<script lang="ts">
	import Header from '$lib/components/molecules/Header.svelte';
	import { m } from '$lib/i18n';

	export let data: string;
</script>

<Header>
	{m.Wallet()}
</Header>

<ion-content fullscreen class="ion-padding space-y-10">
	{JSON.stringify(data)}
</ion-content>
