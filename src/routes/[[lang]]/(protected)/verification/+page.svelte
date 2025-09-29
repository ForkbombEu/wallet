<script lang="ts">
	import { goto, m } from '$lib/i18n';
	import HeaderWithBackButton from '$lib/components/molecules/HeaderWithBackButton.svelte';
	import DebugPopup from '$lib/components/organisms/debug/DebugPopup.svelte';

	export let data;
	const { propertiesArray, post_url } = data;

	const decline = async () => {
		await goto('/');
	};

	const gotoChooseCredential = async () => {
		await goto('/verification/select-credential');
	};
</script>

<HeaderWithBackButton>
	{m.Verification()}
</HeaderWithBackButton>

<ion-content fullscreen class="ion-padding">
	<div class="flex h-full flex-col justify-between gap-3 pb-16">
		<div>
			<!-- <div class="flex items-center gap-2 pb-0.5">
				<d-heading size="s">{'verifier_name'}</d-heading>
				<div
					class="flex h-6 items-center justify-center rounded-md border border-solid border-success px-2"
				>
					<d-text class="text-xs text-success">{m.Verifier_App()}</d-text>
				</div>
			</div> -->
			<d-heading size="xs">{m.Is_asking_for_verification()}</d-heading><br />
		</div>

		<div>
			<d-text size="l">{m.About_this_verifications()}</d-text>
			<div class="flex flex-col items-start gap-2.5 rounded-[5px] bg-primary px-5 py-5">
				<!-- <div class="flex items-center gap-2.5">
					<d-info-led type="warning" />
					<d-text><b>{m.Relying_party()}:</b> {'rp_name'}</d-text>
				</div> -->
				<div class="flex items-center gap-2.5">
					<d-info-led type="warning" />
					<d-text class="break-all"><b>{m.Url()}:</b> {post_url}</d-text>
				</div>
			</div>
		</div>
		<div>
			<d-text size="l">{m.Confirm_data_to_be_disclosed()}:</d-text>
			<div class="flex flex-col items-start gap-2.5 rounded-[5px] bg-primary px-5 py-5">
				{#each propertiesArray as property}
					<div class="flex items-center gap-2.5">
						<d-info-led type="warning" />
						<d-text>{property[0]}</d-text>
					</div>
				{/each}
			</div>
		</div>

		<d-vertical-stack>
			<d-text>{m.Are_you_sure()}</d-text>
			<d-button on:click={gotoChooseCredential} aria-hidden expand color="accent"
				>{m.choose_credential()}</d-button
			>
			<d-button on:click={decline} expand aria-hidden>{m.Decline()}</d-button>
		</d-vertical-stack>
	</div>
	<DebugPopup />
</ion-content>
