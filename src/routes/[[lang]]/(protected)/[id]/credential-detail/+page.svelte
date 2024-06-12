<script lang="ts">
	import Header from '$lib/components/molecules/Header.svelte';
	export let data: any;
	const { credential, credentials } = data;
	import { decodeSdJwt } from '$lib/openId4vci';

	const isNestedDisclosure = (disclosure: Array<string | Record<string, string>>) => {
		return typeof disclosure[2] !== 'string';
	};
</script>

<Header>Credential detail</Header>
<ion-content fullscreen class="h-full">
	<div class="flex h-full flex-col gap-4">
		<div class="ion-padding">
			<div class="flex flex-col gap-6">
				<!-- <d-avatar src={credential.logo.url} alt={credential.logo.alt_text}></d-avatar> -->
				<d-heading size="s">{credential.display_name}</d-heading>
				<dl>
					<dt class="text-xl font-bold not-italic text-on-alt">Issued by:</dt>
					<dd class="flex items-center gap-2 text-xl font-medium not-italic text-on">
						<d-avatar src={credential.logo.url} size="xs" alt={credential.logo.alt_text}></d-avatar>
						<d-text size="l">{credential.issuer}</d-text>
					</dd>
				</dl>
			</div>
		</div>
		<div class="bg-primary w-full flex-grow">
			<d-credential-detail name="Claims:" logoSrc={credential.logo.url}>
				{#await decodeSdJwt(credential.sdJwt) then sdjwt}
					{#each sdjwt.credential.disclosures as disclosure}
						{#if isNestedDisclosure(disclosure)}
							<d-text size="xs">{disclosure[1]}</d-text>
							<div class=" border-2 border-stroke p-1">
								{#each Object.entries(disclosure[2]) as [key, value]}
									<d-definition title={key} definition={value}></d-definition>
								{/each}
							</div>
						{:else}
							<d-definition title={disclosure[1]} definition={disclosure[2]}></d-definition>
						{/if}
					{/each}
				{/await}
				<d-text size="xs">address:</d-text>
				<div class=" border-2 border-stroke p-1">
					<d-definition title="city" definition="napoli"></d-definition>
					<d-definition title="street" definition="via roma"></d-definition>
					<d-definition title="zip" definition="80000"></d-definition>
				</div>
			</d-credential-detail>
		</div>
	</div>
</ion-content>
