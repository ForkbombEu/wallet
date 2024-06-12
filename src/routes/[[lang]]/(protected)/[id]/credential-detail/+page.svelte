<script lang="ts">
	import Header from '$lib/components/molecules/Header.svelte';
	import ScanButton from '$lib/components/molecules/ScanButton.svelte';
	export let data: any;
	const { credential, credentials } = data;
	import { register } from 'swiper/element/bundle';
	import dayjs from 'dayjs';
	import { decodeSdJwt } from '$lib/openId4vci';

	const getIndex = (id: string) => credentials.findIndex((c: any) => c.id === id);

	const sortedCredentials = credentials.slice().sort((a: any, b: any) => {
		const currentTime = dayjs().unix();
		const isAExpired = a.expirationDate < currentTime;
		const isBExpired = b.expirationDate < currentTime;

		if (isAExpired && !isBExpired) return 1;
		if (!isAExpired && isBExpired) return -1;
		return a.expirationDate - b.expirationDate;
	});

	let index = getIndex(credential.id);
	const getCredentialByIndex = () => sortedCredentials[index];

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
		{#each sortedCredentials as credential}
			{@const expirationDate = dayjs.unix(credential.expirationDate).format('DD.MM.YYYY HH:mm')}

			<swiper-slide id={getIndex(credential.id)}>
				<div class="relative">
					{#if credential.expirationDate < dayjs().unix()}
						<div
							class="absolute z-50 flex h-full w-full items-center justify-center rounded-lg bg-primary opacity-80"
						>
							<d-text size="l" class="font-bold uppercase text-error">
								expired on: {expirationDate}
							</d-text>
						</div>
					{/if}
					<d-credential-card
						{...credential}
						{expirationDate}
						name={credential.display_name}
						logoSrc={credential.logo.url}
						description=""
					/>
				</div>
			</swiper-slide>
		{/each}
	</swiper-container>
	<div class="bg-tab fixed bottom-0 left-0 w-full">
		<d-credential-detail
			{...detailCredential}
			description={detailCredential.description}
			name={detailCredential.display_name}
			logoSrc={detailCredential.logo.url}
		>
			{#await decodeSdJwt(detailCredential.sdJwt) then sdjwt}
				{#each sdjwt.credential.disclosures as disclosure}
					<d-definition title={disclosure[1]} definition={disclosure[2]}></d-definition>
				{/each}
			{/await}
		</d-credential-detail>
	</div>
</ion-content>
