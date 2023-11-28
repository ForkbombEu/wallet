<script lang="ts">
	import type { SuperformGeneric } from './types';
	import type { AnyZodObject } from 'zod';

	type SchemaGeneric = $$Generic<AnyZodObject>;
	export let superform: SuperformGeneric<SchemaGeneric>;

	const { enhance, delayed } = superform;
</script>

<form method="post" use:enhance>
	<slot delayed={$delayed} />
</form>

{#if $delayed}
	<slot name="loading" />
{/if}
