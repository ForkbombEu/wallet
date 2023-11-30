<script lang="ts">
	import type { SuperformGeneric } from './types';
	import type { z } from 'zod';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import { isObject, set, has, get, isArray } from 'lodash';

	//

	type T = $$Generic<z.AnyZodObject>;

	export let superform: SuperformGeneric<T>;
	export let fieldPath: FormPathLeaves<z.infer<T>>;

	const { form } = superform;
	const { value, errors, constraints } = formFieldProxy(superform, fieldPath);

	//

	function updateValue(newValue: typeof $value) {
		if (isNestedField(fieldPath)) set($form, fieldPath, newValue);
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

	//

	$: extractedErrors = extractErrors($errors);
	function extractErrors(errors: unknown): string[] | undefined {
		if (isObject(errors) && has(errors, '_errors')) {
			const _errors = get(errors, '_errors');
			if (isArray(_errors)) return _errors;
			else return undefined;
		} else if (isArray(errors)) {
			return errors;
		} else {
			return undefined;
		}
	}

	$: errorsText = getErrorText(extractedErrors);
	function getErrorText(errors: ReturnType<typeof extractErrors>): string | undefined {
		if (!errors) return undefined;
		return errors.join('\n');
	}
</script>

<slot
	field={fieldPath}
	value={$value}
	{updateValue}
	errors={extractedErrors}
	errorText={errorsText}
	constraints={$constraints}
/>
