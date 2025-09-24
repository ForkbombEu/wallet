<script lang="ts">
	import { r } from '$lib/i18n';
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
	{success ? 'verification succeeded' : 'verification failed'}
</d-header>

<ion-content fullscreen class="ion-padding">
	<d-feedback {...feedback} />
	<div class="flex w-full justify-around">
		{#if id === ''}
			<d-session-card
				{date}
				success={success}
				success-message={'verification success'}
				failure-message={'verification failed'}
				session-message=''
			/>
		{:else}
			<d-session-card
				sid={shorterId(id)}
				{date}
				success={success}
				success-message={'verification success'}
				failure-message={'verification failed'}
				session-message={'transaction id'}
			/>
		{/if}
	</div>
</ion-content>
