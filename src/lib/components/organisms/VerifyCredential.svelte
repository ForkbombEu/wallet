<script lang="ts" context="module">
	export interface StepperContext {
		link: string;
	}
</script>

<script lang="ts">
	import { Stepper, makeStep } from '@efstajas/svelte-stepper';
	import { writable, type Writable } from 'svelte/store';

	const steps = [
		makeStep({
			component: MyFirstStep,
			props: undefined
		})
	];

	const stepperContext: () => Writable<StepperContext> = () =>
		writable({
			link: 'bar'
		});
</script>

<Stepper {steps} context={stepperContext} />
