<script lang="ts">
	import type { Service } from '$lib/slangroom/services';
	import { goto, m } from '$lib/i18n';
	import type { Feedback } from '$lib/utils/types';
	import { credentialOfferStore } from '$lib/credentialOfferStore';
	import type { Service as CredentialService } from '$lib/components/organisms/scanner/tools';
	import { scanButton } from '$lib/tabs';
	import {
		getHomeFeedbacks,
		setFeedbackAsSeen,
		type HomeFeedbackType
	} from '$lib/homeFeedbackPreferences.js';
	import { onMount } from 'svelte';

	export let data;
	const { services } = data;

	let feedback: { content?: Feedback; type?: HomeFeedbackType } = {};

	const getFeedbacks = async () => (feedback = (await getHomeFeedbacks())[0]);

	onMount(getFeedbacks);

	const onFeedbackClose = async () => {
		if (!feedback.type) return;
		await setFeedbackAsSeen(feedback.type);
		await getFeedbacks();
	};

	const gotoCredentialOffer = async (service: Service) => {
		const credential: CredentialService = {
			credential_configuration_ids: [service.type_name],
			credential_issuer: service.expand.credential_issuer.endpoint
		};
		credentialOfferStore.set(credential);
		await goto('/credential-offer');
	};
</script>

<d-tab-page tab="home" title="HOME" {...scanButton}>
	<d-feedback {...feedback?.content} on:dClose={onFeedbackClose} />
	<d-page-description
		title={m.Claim_credential()}
		description={m.Scan_QR_code_to_claim_credential_or_request_one_below()}
	/>
	<d-list>
		{#each services as service}
			<d-credential-service
				name={service.display_name}
				issuer={service.expand.credential_issuer.name}
				organization={service.expand.organization.name}
				logoSrc={service.logo}
				href="#"
				on:click={() => gotoCredentialOffer(service)}
				on:keydown={() => gotoCredentialOffer(service)}
				aria-hidden
			/>
		{/each}
	</d-list>
</d-tab-page>
