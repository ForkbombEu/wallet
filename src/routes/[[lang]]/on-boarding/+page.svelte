<script lang="ts">
	import First from '$lib/components/organisms/onBoarding/First.svelte';
	import Second from '$lib/components/organisms/onBoarding/Second.svelte';
	import Third from '$lib/components/organisms/onBoarding/Third.svelte';
	import { Stepper, makeStep } from '@efstajas/svelte-stepper';

	const steps = [
		makeStep({
			component: First,
			props: {index: 0, total: 3}
		}),
		makeStep({
			component: Second,
			props: {index: 1, total: 3}
		}),
		makeStep({
			component: Third,
			props: {index: 2, total: 3}
		})
	];
</script>

<Stepper {steps} disableTransitions />
