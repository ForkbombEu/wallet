<script lang="ts">
	import { r, m } from '$lib/i18n';
	import { verificationResultsStore } from '$lib/verificationResultsStore';
	const { feedback, date, id, success } = $verificationResultsStore;
	const gotoHome = async () => {
		window.location.href = r('/home')
	};

	const shorterId = (id: string) => {
		const part = id?.split('transaction/')[1] || '';
		return part.length > 10 ? part.slice(0, 10) + '...' : part;
	};
</script>

<d-header back-button on:backButtonClick={gotoHome}>
	{success ? m.verification_success() : m.verification_failed()}
</d-header>

<ion-content fullscreen class="ion-padding">
	<d-feedback {...feedback} />
	<div class="flex w-full justify-around">
		{#if id === ''}
			<d-session-card
				{date}
				success={success}
				verified-message={m.verified()}
				failure-message={m.verification_failed()}
				session-message=''
			/>
		{:else}
			<d-session-card
				sid={shorterId(id)}
				{date}
				success={success}
				verified-message={m.verified()}
				failure-message={m.verification_failed()}
				session-message={m.transaction_id()}
			/>
		{/if}
	</div>
</ion-content>
