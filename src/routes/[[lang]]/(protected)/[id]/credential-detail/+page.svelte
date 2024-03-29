<script lang="ts">
	import Header from '$lib/components/molecules/Header.svelte';
	import { r } from '$lib/i18n';
	export let data: any;
	const { credential } = data;
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
		<d-credential-detail
			{...credential}
			description={credential.description}
			logoSrc={credential.logo.url}
		>
			<d-button color="accent" href={r('/scan/')} expand>Verify</d-button>
		</d-credential-detail>
	</div>
</ion-content>
