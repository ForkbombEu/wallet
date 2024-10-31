<script lang="ts">
	import { goto, m, r } from '$lib/i18n';
	import { verificationResultsStore } from '$lib/verificationResultsStore';
	const { feedback, date, id, success } = $verificationResultsStore;
	const gotoHome = async () => {
		window.location.href = r('/home')
	};
</script>

<d-header back-button on:backButtonClick={gotoHome}>
	{success ? 'verification started' : 'verification failed'}
</d-header>

<ion-content fullscreen class="ion-padding">
	<d-feedback {...feedback} />
	<div class="flex w-full justify-around">
		<d-session-card
			sid={id}
			{date}
			in-progress={success}
			in-progress-message={'in progress'}
			failure-message={'verification failed'}
			session-message={'session'}
		/>
	</div>
</ion-content>
