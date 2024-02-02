<script lang="ts">
  import { createStepController } from '@efstajas/svelte-stepper';
	import { completeOnBoarding } from './utils';

  const stepController = createStepController();


</script>

<div class="flex h-full flex-col justify-around items-center">
	<d-heading size="xl">3</d-heading>
	<d-heading size="m">On-boarding</d-heading>
  <ion-button on:click={completeOnBoarding}>Complete on boarding</ion-button>
</div>
