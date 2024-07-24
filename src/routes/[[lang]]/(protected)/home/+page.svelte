<script lang="ts">
	import type { Service } from '$lib/slangroom/services';
	import { goto, m } from '$lib/i18n';
	import type { Feedback } from '$lib/utils/types';
	import { homeFeedbackStore } from '$lib/homeFeedbackStore';
	import { credentialOfferStore } from '$lib/credentialOfferStore';
	import type { Service as CredentialService } from '$lib/components/organisms/scanner/tools';
	import { getNotReadedActivities } from '$lib/preferences/activity';
	import { getExpiredCredentials } from '$lib/preferences/credentials';
	import { scanButton } from '$lib/tabs';

	export let data;
	const { services } = data;

	let feedback: Feedback = $homeFeedbackStore;

	const setFeedback = async () => {
		const notReadedActivities = await getNotReadedActivities();
		if (notReadedActivities && notReadedActivities > 0) {
			homeFeedbackStore.set({
				type: 'success',
				feedback: `You have ${notReadedActivities} new ${notReadedActivities > 1 ? 'activities' : 'activity'}`
			} as Feedback);
		}
		const expiredCredentials = await getExpiredCredentials();
		const expiredLenght = expiredCredentials.length;
		if (expiredLenght > 0) {
			homeFeedbackStore.set({
				type: 'error',
				feedback: `You have ${expiredLenght} expired credential${expiredLenght > 1 ? 's' : ''}.`
			});
		}
	};

	$: setFeedback();

	const onFeedbackClose = () => {
		homeFeedbackStore.set({});
	};

	const gotoCrendentialOffer = async (service: Service) => {
		const credential: CredentialService = {
			credential_configuration_ids: [service.type_name],
			credential_issuer: service.expand.credential_issuer.endpoint
		};
		credentialOfferStore.set(credential);
		await goto('/credential-offer');
	};
</script>

<d-tab-page tab="home" title="HOME" {...scanButton}>
	<d-feedback {...feedback} on:dClose={onFeedbackClose} />
	<d-page-description
		title={m.Claim_credential()}
		description={m.Scan_QR_code_to_claim_credential_or_request_one_below()}
	/>
	<div class="flex flex-col gap-2">
		{#each services as service}
			<d-credential-service
				name={service.display_name}
				issuer={service.expand.credential_issuer.name}
				issuerLabel={m.Issuer()}
				logoSrc={service.logo}
				description={service.description}
				href="#"
				on:click={() => gotoCrendentialOffer(service)}
				on:keydown={() => gotoCrendentialOffer(service)}
				aria-hidden
			/>
		{/each}
	</div>
</d-tab-page>
