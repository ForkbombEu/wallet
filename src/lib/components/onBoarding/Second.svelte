<script lang="ts">
  import { createStepController } from '@efstajas/svelte-stepper';

  const stepController = createStepController();
</script>

<div class="flex h-full flex-col justify-around items-center">
	<d-heading size="xl">2</d-heading>
	<d-heading size="m">On-boarding</d-heading>
  <ion-button on:click={stepController.nextStep}>Next</ion-button>
</div>
