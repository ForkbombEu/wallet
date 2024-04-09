<script lang="ts">
	import Header from '$lib/components/molecules/Header.svelte';
	import ScanButton from '$lib/components/molecules/ScanButton.svelte';
	import { r } from '$lib/i18n';
	export let data: any;
	const { credential, credentials } = data;
	import { register } from 'swiper/element/bundle';

	const getIndex = (id: string) => credentials.findIndex((c: any) => c.id === id);
	let index = getIndex(credential.id);
	const getCredentialByIndex = () => credentials[index];

	let detailCredential = getCredentialByIndex();

	const onChanges = (e: any) => {
		index = e.detail[0].activeIndex;
		detailCredential = getCredentialByIndex();
	};
	register();
</script>

<Header>Credential detail</Header>
<ion-content fullscreen>
	<swiper-container
		centered-slides={true}
		pagination={true}
		initialSlide={index}
		on:swiperslidechange={onChanges}
		slidesPerView={1.15}
		centeredSlides={true}
		spaceBetween={10}
		class="mt-8"
	>
		{#each credentials as credential}
			<swiper-slide id={getIndex(credential.id)}
				><d-credential-card
					{...credential}
					name={credential.display_name}
					description=""
					issuer={credential.credential_issuer.length > 18
						? credential.credential_issuer.slice(0, 18) + '...'
						: credential.credential_issuer}
				/>
			</swiper-slide>
		{/each}
	</swiper-container>
	<div class="bg-tab fixed bottom-0 left-0 w-full">
		<d-credential-detail
			{...detailCredential}
			description={detailCredential.description}
			logoSrc={detailCredential.logo.url}
		>
		</d-credential-detail>
	</div>
	<ScanButton />
</ion-content>
