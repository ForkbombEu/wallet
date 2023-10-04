<svelte:head>
	<title>Ionic Companion - Tabs Explain</title>
</svelte:head>

<ion-tab tab="credentials">
	<ion-header translucent={true}>
		<ion-toolbar>
			<ion-buttons slot="start">
				<ion-menu-button />
			</ion-buttons>
			<ion-title>Explanation</ion-title>
		</ion-toolbar>
	</ion-header>

	<ion-content fullscreen class="ion-padding">
		<h1>Explanation of TABS</h1>

		<p>
			Tabs are a real joy working within Svelte since we are now able to use SvelteKit routing and layouts to create
			nested routeroutlets. This demo app itself has not yet been upgraded to this, but there is a HOWTO-you can look at
			to see how it works.
		</p>

		<p>
			Use a href to navigate to other tabs
			<a href="/components/tabs/explain">explain</a>
		</p>

		<p>This also solves some earlier issues and eases the DX.</p>
		<p>
			<a href="https://github.com/Tommertom/ionic-svelte-tabs-howto" target="_new"
				>https://github.com/Tommertom/ionic-svelte-tabs-howto</a
			>
		</p>
	</ion-content>
</ion-tab>
