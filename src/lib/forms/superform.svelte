<script lang="ts">
	import type { SuperformGeneric } from './types';
	import type { AnyZodObject } from 'zod';

	type SchemaGeneric = $$Generic<AnyZodObject>;
	export let superform: SuperformGeneric<SchemaGeneric>;

	const { enhance, delayed, form, errors } = superform;
</script>

<form method="post" use:enhance>
	<slot />
</form>

{#if $delayed}
	loading...
{/if}

<div class="flex">
	<pre>{JSON.stringify($form, null, 2)}</pre>
	<pre>{JSON.stringify($errors, null, 2)}</pre>
</div>
