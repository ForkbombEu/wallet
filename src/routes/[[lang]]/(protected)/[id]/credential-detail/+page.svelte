<script lang="ts">
	import Header from '$lib/components/molecules/Header.svelte';
	import { r } from '$lib/i18n';
	import { decodeSdJwt } from '$lib/openId4vci';
	export let data: any;
	const { credential } = data;

	const description = decodeSdJwt(credential.sdJwt);
</script>

<Header>Credential detail</Header>
<ion-content fullscreen class="ion-padding">
	<d-credential-card
		{...credential}
		issuer={credential.issuer.length > 18
			? credential.issuer.slice(0, 18) + '...'
			: credential.issuer}
	/>
	<div class="bg-tab fixed bottom-0 left-0 w-full">
		{#await description then description}
			<d-credential-detail {...credential} description={JSON.stringify(description)}>
				<d-button color="accent" href={r('/scan/')} expand>Verify</d-button>
			</d-credential-detail>
		{/await}
	</div>
</ion-content>
