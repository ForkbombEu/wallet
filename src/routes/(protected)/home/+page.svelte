<script lang="ts">
	import ScanButton from '$lib/components/molecules/ScanButton.svelte';
	import TabPage from '$lib/tabs/TabPage.svelte';
	import { getServices } from '$lib/slangroom/services';
</script>

<TabPage tab="home" title="HOME">
	{#await getServices()}
		<ion-spinner />
	{:then res}
		{@const services = res.result.items}
		<div class="flex flex-col gap-2 px-4">
			{#each services as service}
				<d-credential-service name={service.name} issuer={service.issuer} href={`/request/${service.id}`} />
			{/each}
		</div>
	{/await}
	<ScanButton />
</TabPage>
