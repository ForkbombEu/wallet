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
			in-progress-message={m.tidy_royal_giraffe_stop()}
			success-message={m.just_sleek_ape_fall()}
			failure-message={m.teary_seemly_dragonfly_cheer()}
			session-message={m.petty_fit_flea_twirl()}
		/>
	</div>
</ion-content>
