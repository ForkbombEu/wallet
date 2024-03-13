<script lang="ts">
	import First from '$lib/components/onBoarding/First.svelte';
	import Second from '$lib/components/onBoarding/Second.svelte';
	import Third from '$lib/components/onBoarding/Third.svelte';
	import { Stepper, makeStep } from '@efstajas/svelte-stepper';

	const steps = [
		makeStep({
			component: First,
			props: { index: 0, total: 3 }
		}),
		makeStep({
			component: Second,
			props: { index: 1, total: 3 }
		}),
		makeStep({
			component: Third,
			props: { index: 2, total: 3 }
		})
	];
</script>

<Stepper {steps} />
