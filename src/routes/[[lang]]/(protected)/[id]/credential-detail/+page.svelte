<script lang="ts">
	import Header from '$lib/components/molecules/Header.svelte';
	import { r,  m } from '$lib/i18n';
	export let data: any;
	const { credential } = data;
</script>

<Header>Credential detail</Header>
<ion-content fullscreen class="ion-padding">
	<d-credential-card {...credential} expiration-date="2017-01-01" verified="false"> </d-credential-card>
	<div class="bg-tab fixed bottom-0 left-0 w-full">
		<d-credential-detail {...credential} description={credential.expand.templates[0].name}>
			<!-- <d-button color="accent" href={r(`/${credential.id}/verify/`)}>{m.Generate_QR()}</d-button> -->
		</d-credential-detail>
	</div>
</ion-content>
