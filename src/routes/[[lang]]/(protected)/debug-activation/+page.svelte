<script lang="ts">
	import { goto, m } from '$lib/i18n';
	import { getDebugMode, setDebugModeFalse, setDebugModeTrue } from '$lib/preferences/debug';
	const gotoHome = async () => {
		await goto('/home');
	};
	let debugMode: boolean;
	const loadDebugMode = async () => {
		debugMode = await getDebugMode();
	};
	$: loadDebugMode();
	const setDebugMode = async () => {
		debugMode ? await setDebugModeFalse() : await setDebugModeTrue();
		await loadDebugMode();
	};
</script>

<d-header back-button on:backButtonClick={gotoHome}> {m.Debug_mode()} </d-header>

<ion-content fullscreen class="ion-padding">
	<d-vertical-stack>
		<d-background-illustration class="-mb-8">
			<d-illustration illustration="card-cloud" />
		</d-background-illustration>
		<d-text>
			{m.cool_tired_pig_dine()}
		</d-text>
		<d-button on:click={setDebugMode} expand aria-hidden
			>{debugMode ? m.Deactivate() : m.Activate()} {m.Debug_mode()}</d-button
		>
		{#if !debugMode}
			<d-button on:click={gotoHome} expand aria-hidden color="accent">{m.Go_to_home()}</d-button>
		{/if}
	</d-vertical-stack>
</ion-content>
