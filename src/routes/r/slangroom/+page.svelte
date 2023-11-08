<script lang="ts">
	import * as slangroom from '$lib/slangroom';
	import { onMount } from 'svelte';

	let ls: any = null;
	let pocketbaseAuth = `Cannot read "pocketbase_auth".`;
	let results: any = {};

	const read = () => !!ls && ls.getItem(`pocketbase_auth`);
	const getToken = () => JSON.parse(pocketbaseAuth).token;

	onMount(() => {
		typeof localStorage !== `undefined` && (ls = localStorage);
		pocketbaseAuth = read();
		showSlangroomResult();
	});
	const keysToExclude = ['authWithPassword', 'updateProfile', 'organizationServices'] as const;
	type KeysToExclude = (typeof keysToExclude)[number];
	const slangroomKeys = Object.keys(slangroom).filter(
		(key) => !keysToExclude.includes(key as KeysToExclude)
	) as unknown as Exclude<keyof typeof slangroom, (typeof keysToExclude)[number]>[];
	type Key = (typeof slangroomKeys)[number];
	const userId = 'dxecb79ag6av1w4';

	const showSlangroomResult = async (id = userId) => {
		const token =
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJfcGJfdXNlcnNfYXV0aF8iLCJleHAiOjE3MDA2NjIwMDEsImlkIjoiZHhlY2I3OWFnNmF2MXc0IiwidHlwZSI6ImF1dGhSZWNvcmQifQ.CqStsuoZRyaJGVPA96-wtxYc2ow7Q_IsE6I_7ZKebfw';
		slangroomKeys.forEach(async (key) => (results[key] = await slangroom[key as Key]({ id, token })));
		console.log(results);
	};
</script>

<ion-tab tab="slangroom">
	<ion-header translucent={true}>
		<ion-toolbar>
			<ion-buttons slot="start">
				<ion-menu-button />
			</ion-buttons>
			<ion-title>Slangroom</ion-title>
		</ion-toolbar>
	</ion-header>

	<ion-content fullscreen class="ion-padding">
		<h1 class="mb-10 text-3xl font-bold">Test Slangroom calls</h1>
		<ion-accordion-group>
			{#each slangroomKeys as k}
				<ion-accordion value={k}>
					<ion-item slot="header" color="light">
						<ion-label>{k}</ion-label>
					</ion-item>
					<div class="ion-padding" slot="content">
						{#await showSlangroomResult}
							waiting
						{:then}
							<pre>
                                {JSON.stringify(results?.[k], null, 2)}
                            </pre>
						{:catch}
							error
						{/await}
					</div>
				</ion-accordion>
			{/each}
		</ion-accordion-group>
	</ion-content>
</ion-tab>
