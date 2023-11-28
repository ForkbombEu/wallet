<script lang="ts">
	import type { SuperformGeneric } from './types';
	import type { z } from 'zod';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import _ from 'lodash';

	//

	type T = $$Generic<z.AnyZodObject>;

	export let superform: SuperformGeneric<T>;
	export let fieldPath: FormPathLeaves<z.infer<T>>;

	//

	const { form } = superform;
	const { value, errors, constraints } = formFieldProxy(superform, fieldPath);

	function updateValue(newValue: typeof $value) {
		if (isNestedField(fieldPath)) _.set($form, fieldPath, newValue);
		/**
		 * Lodash "_.set" is needed because creates parent objects if missing.
		 * This is needed because superforms didn't do this before v1.11.0
		 * Superforms v1.11 now also this feature, but it doesn't seem to work with objects within arrays
		 * Reference: https://github.com/ciscoheat/sveltekit-superforms/releases/tag/v1.11.0
		 */
		value.set(newValue);
	}

	function isNestedField(fieldPath: string) {
		return fieldPath.includes('.') || fieldPath.includes('[');
	}
</script>

<slot field={fieldPath} value={$value} {updateValue} errors={$errors} constraints={$constraints} />
