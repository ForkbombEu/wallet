<script lang="ts">
	import Questions from '$lib/loginSteps/Questions.svelte';
	import Email from '$lib/loginSteps/email.svelte';
	import { Stepper, makeStep } from '@efstajas/svelte-stepper';
    import type { PageData } from '../../routes/$types';


	// const exampleSteps = [
	// 	makeStep({
	// 		component: Questions,
	// 		props: undefined
	// 	}),
	// 	makeStep({
	// 		component: Questions,
	// 		props: undefined
	// 	})
	// ];
</script>

<ion-tab tab="login">
	<ion-header translucent={true}>
		<ion-toolbar>
			<ion-buttons slot="start">
				<ion-menu-button />
			</ion-buttons>
			<ion-title>Login / Signup</ion-title>
		</ion-toolbar>
	</ion-header>

	<ion-content fullscreen class="ion-padding">
        <Questions />
		<!-- <Stepper steps={exampleSteps} /> -->
	</ion-content>
</ion-tab>
