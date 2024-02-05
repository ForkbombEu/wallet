<script lang="ts">
	import Logo from '$lib/components/atoms/Logo.svelte';
	import * as m from "$paraglide/messages"

	export let data:string
</script>

<ion-header>
	<ion-toolbar>
		<ion-title>
			<div class="flex items-center gap-2">
				<Logo />
				<h1 class="text-2xl">{m.Wallet()}</h1>
			</div>
		</ion-title>
	</ion-toolbar>
</ion-header>

<ion-content fullscreen class="ion-padding space-y-10">
	{JSON.stringify(data)}
</ion-content>
