<script lang="ts">
	import First from '$lib/components/onBoarding/First.svelte';
	import Second from '$lib/components/onBoarding/Second.svelte';
	import Third from '$lib/components/onBoarding/Third.svelte';
	import { Stepper, makeStep } from '@efstajas/svelte-stepper';

	const steps = [
		makeStep({
			component: First,
			props: undefined
		}),
		makeStep({
			component: Second,
			props: undefined
		}),
		makeStep({
			component: Third,
			props: undefined
		})
	];
</script>

<Stepper {steps} />
