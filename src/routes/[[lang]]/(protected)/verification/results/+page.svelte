<script lang="ts">
	import { m } from '$lib/i18n';
	import HeaderWithBackButton from '$lib/components/molecules/HeaderWithBackButton.svelte';
	import { verificationResultsStore } from '$lib/verificationResultsStore';

	const { feedback, date, id, success } = $verificationResultsStore;
</script>

<HeaderWithBackButton>
	{success ? 'verification started' : 'verification failed'}
</HeaderWithBackButton>

<ion-content fullscreen class="ion-padding">
	<d-feedback {...feedback} class="break-all" />

	<div class="flex w-full justify-around">
		<d-session-card sid={id} {date} {success} />
	</div>
</ion-content>
