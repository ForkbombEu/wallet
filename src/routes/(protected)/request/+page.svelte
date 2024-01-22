<script>
	import Logo from '$lib/components/atoms/Logo.svelte';
</script>

<ion-header>
	<ion-toolbar>
		<ion-title>
			<div class="flex items-center gap-2">
				<Logo />
				<h1 class="text-2xl">Wallet</h1>
			</div>
		</ion-title>
	</ion-toolbar>
</ion-header>

<ion-content fullscreen class="ion-padding space-y-10">
	<ion-text>Request credentials:</ion-text>
	<h1 class="text-[32px] font-medium leading-[20.5px] tracking-[-0.5px] text-[#E8D2FF]">Over 18</h1>
	<br />
	<ion-text>Verified by ITGov</ion-text>
	<br />
	<br />
	<ion-text>This is asking for:</ion-text>
	<ion-text>
		<ul class="list-disc pl-4">
			<li>Your name</li>
			<li>Your surname</li>
			<li>Your date of birth</li>
			<li>Your place of birth</li>
			<li>Your fiscal code</li>
		</ul>
	</ion-text>
	<br />
	<ion-text>Expires on: 29/02/2024</ion-text>
	<br />
	<ion-button>Confirm request</ion-button>
</ion-content>
