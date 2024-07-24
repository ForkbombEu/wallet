<script lang="ts">
	import { goto, m } from '$lib/i18n';
	export let data: any;
	const { credential, credentials } = data;
	import { decodeSdJwt } from '$lib/openId4vci';
	import { removeCredentialPreference } from '$lib/preferences/credentials';
	import { routeHistory } from '$lib/routeStore';

	const isNestedDisclosure = (disclosure: Array<string | Record<string, string>>) => {
		return typeof disclosure[2] === 'object';
	};

	const deleteCredential = () => removeCredentialPreference(credential.id);
</script>

<d-header back-button backFunction={routeHistory.back}>
	{m.Credential_detail()}
</d-header>
<ion-content fullscreen class="ion-padding h-full">
	<div class="flex h-full flex-col gap-8">
		<div class="flex flex-col gap-2">
			<div class="flex items-center gap-2 text-xl font-semibold not-italic text-on">
				<d-avatar src={credential.logo.url} alt={credential.logo.alt_text} shape="square"
				></d-avatar>
				<d-heading class="font-semibold" size="xs">
					{credential.display_name}
				</d-heading>
			</div>
			<d-text class="text-on-alt">{credential.description}</d-text>
			<d-text
				>{m.Issued_by()}:
				<span class="font-semibold">{credential.issuer}</span></d-text
			>
		</div>
		<div class="flex h-full flex-grow flex-col justify-between pb-16">
			<div class="flex flex-col gap-2">
				<d-heading size="xs" class="font-bold"> Claims: </d-heading>
				<div class="flex flex-col gap-2">
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
								<!-- <d-text
									>{disclosure[1]}:
									<span class="font-semibold">{disclosure[2]}</span></d-text
								> -->
							{/if}
						{/each}
					{/await}
				</div>
			</div>
			<div class="flex flex-col">
				<d-button expand color="primary" on:click={() => goto('/wallet')}>{m.ok()}</d-button>
				<d-button expand color="accent" on:click={deleteCredential}>Delete</d-button>
			</div>
		</div>
	</div>
</ion-content>
