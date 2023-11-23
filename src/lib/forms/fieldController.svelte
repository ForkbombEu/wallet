<script lang="ts">
	import type { SuperformGeneric } from './types';
	import type { z } from 'zod';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import { formFieldProxy } from 'sveltekit-superforms/client';

	type T = $$Generic<z.AnyZodObject>;

	export let superform: SuperformGeneric<T>;
	export let field: FormPathLeaves<z.infer<T>>;
	export let nested: 'array' | 'object' | undefined = undefined;

	const { value, errors, constraints } = formFieldProxy(superform, field);

	function updateValue(newValue: typeof $value) {
		value.set(newValue);
	}

	if (!$value && nested) {
		if (nested == 'array') ($value as unknown) = [];
		else if (nested == 'object') ($value as unknown) = {};
	}
</script>

<slot {field} value={$value} {updateValue} errors={$errors} constraints={$constraints} />
