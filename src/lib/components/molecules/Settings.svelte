<script>
	import { page } from "$app/stores";
	import { goto, i18n } from "$lib/i18n";
	import { setLanguagePreference } from "$lib/preferences/lang";
	import { availableLanguageTags } from "$paraglide/runtime";

</script>
<div class="flex flex-col gap-2">
    <hr />
	<d-heading size="xs">Language</d-heading>
	<ion-radio-group
		value={i18n.getLanguageFromUrl($page.url)}
		on:ionChange={async (e) => {
            await setLanguagePreference(e.detail.value);
			await goto(i18n.route($page.url.pathname), e.detail.value);
		}}
	>
		{#each availableLanguageTags as language}
			<ion-radio label-placement="end" value={language}>{language}</ion-radio>
			<br />
		{/each}
	</ion-radio-group>
    <hr />
</div>
