<script lang="ts">
	import { page } from '$app/stores';
	import { goto, i18n, m } from '$lib/i18n';
	import { setLanguagePreference } from '$lib/preferences/lang';
	import { availableLanguageTags } from '$paraglide/runtime';
	import Check from '$lib/assets/check.svelte';
	import { routeHistory } from '$lib/routeStore';

	const recordLanguages = {
		en: 'English',
		es: 'Español',
		fr: 'Français',
		de: 'Deutsch',
		it: 'Italiano'
	};
	$: activeLanguage = i18n.getLanguageFromUrl($page.url);
</script>

<d-header back-button backFunction={routeHistory.back}>
	{m.language()}
</d-header>

<ion-content fullscreen class="ion-padding">
	{#each availableLanguageTags as language}
		{#if activeLanguage === language}
			<button
				class="flex h-16 w-full items-center justify-between gap-2.5 rounded-lg border-b border-solid border-b-stroke bg-primary px-5 py-8"
			>
				<span class="flex items-center self-stretch">
					{recordLanguages[language]}
				</span>
				<span><Check /></span>
			</button>
		{:else}
			<button
				class="flex h-16 w-full items-center justify-between gap-2.5 rounded-lg border-b border-solid border-b-stroke px-5 py-8"
				on:click={async () => {
					await setLanguagePreference(language);
					await goto(i18n.route($page.url.pathname), language, false);
				}}
			>
				<span class="flex items-center self-stretch">
					{recordLanguages[language]}
				</span>
			</button>
		{/if}
	{/each}
</ion-content>
