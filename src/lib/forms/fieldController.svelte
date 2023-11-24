<script lang="ts">
	import { getAllContexts, setContext } from 'svelte';

	import type { SuperformGeneric } from './types';
	import type { z } from 'zod';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import { formFieldProxy } from 'sveltekit-superforms/client';

	//

	type T = $$Generic<z.AnyZodObject>;

	export let superform: SuperformGeneric<T>;
	export let fieldPath: FormPathLeaves<z.infer<T>>;
	export let nested: undefined | 'object' | 'array' = undefined;

	const { value, errors, constraints } = formFieldProxy(superform, fieldPath);

	//

	const initValueContexts = getAllContexts<Map<string, typeof initValue>>();
	const lastInitValue = Array.from(initValueContexts.entries()).at(-1)?.[1];

	function initValue() {
		if (Boolean($value)) return;
		if (lastInitValue) lastInitValue();
		if (nested == 'array') value.set([] as any);
		else if (nested == 'object') value.set({} as any);
	}

	if (nested) setContext(fieldPath, initValue);

	//

	function updateValue(newValue: typeof $value) {
		if (lastInitValue) lastInitValue();
		value.set(newValue);
	}
</script>

<slot field={fieldPath} value={$value} {updateValue} errors={$errors} constraints={$constraints} />
