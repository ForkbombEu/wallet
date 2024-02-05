<script lang="ts">
	import { availableLanguageTags } from '$paraglide/runtime';
	import { page } from '$app/stores';
	import { goto, i18n, m } from '$lib/i18n';
</script>
	<!-- <ion-label>{m.Language()}</ion-label> -->
	<ion-select
		aria-label={m.Language()}
		value={i18n.getLanguageFromUrl($page.url)}
		on:ionChange={(e) => {
			goto(i18n.route($page.url.pathname), e.detail.value);
		}}
		class="w-fit"
	>
		{#each availableLanguageTags as tag}
			<ion-select-option value={tag}>{tag}</ion-select-option>
		{/each}
	</ion-select>
