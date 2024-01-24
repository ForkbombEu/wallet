<script lang="ts">
	import Logo from '../atoms/Logo.svelte';

	export let title: string;
	export let tabId: 'home' | 'wallet' | 'notifications' | 'profile';
</script>

<ion-tab tab={tabId}>
	<ion-header>
		<ion-toolbar>
			<ion-title>
				<div class="flex items-center gap-2">
					<Logo />
					<h1 class="text-2xl">Didroom wallet</h1>
				</div>
			</ion-title>
		</ion-toolbar>
	</ion-header>

	<ion-content fullscreen class="ion-padding space-y-10">
		<h1 class="text-[32px] font-medium leading-[20.5px] tracking-[-0.5px] text-[#E8D2FF]">{title}</h1>
		<slot />
	</ion-content>
</ion-tab>

<style lang="postcss">
	.header {
		background: linear-gradient(0deg, #56566d 0%, #56566d 100%),
			linear-gradient(0deg, rgba(127, 89, 167, 0.2) 0%, rgba(127, 89, 167, 0.2) 100%),
			linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
			linear-gradient(0deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.2) 100%), #1f2a37;
	}
</style>
