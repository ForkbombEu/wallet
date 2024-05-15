<script lang="ts">
	import Header from '$lib/components/molecules/Header.svelte';
	import { page } from '$app/stores';
	import { goto, i18n } from '$lib/i18n';
	import { setLanguagePreference } from '$lib/preferences/lang';
	import { availableLanguageTags } from '$paraglide/runtime';

	const recordLanguages = {
		en: 'English',
		es: 'Spanish',
		fr: 'French',
		de: 'German',
		it: 'Italian',
		ja: 'Japanese',
		ko: 'Korean',
		pt: 'Portuguese',
		ru: 'Russian',
		zh: 'Chinese'
	};
</script>

<Header>Languages</Header>

<ion-content fullscreen class="ion-padding">
	<d-heading size="xs">Language</d-heading>
	<ion-radio-group
		value={i18n.getLanguageFromUrl($page.url)}
		on:ionChange={async (e) => {
			await setLanguagePreference(e.detail.value);
			await goto(i18n.route($page.url.pathname), e.detail.value);
		}}
	>
		<br />
		{#each availableLanguageTags as language}
			<ion-radio label-placement="end" value={language}>{recordLanguages[language]}</ion-radio>
			<br />
		{/each}
	</ion-radio-group>
</ion-content>
