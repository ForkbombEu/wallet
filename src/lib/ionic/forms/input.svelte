<script lang="ts">
	import type { z } from 'zod';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import { FieldController } from '$lib/forms';

	//

	type SchemaGeneric = $$Generic<AnyZodObject>;
	export let form: SuperForm<SchemaGeneric>;
	export let fieldPath: FormPathLeaves<z.infer<SchemaGeneric>>;

	export let type: 'email' | 'text' | 'password' = 'text';
	export let label: string | undefined = undefined;
	export let helperText: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;
</script>

<FieldController {form} {fieldPath} let:value let:errorText let:updateValue>
	<d-input
		{type}
		name={fieldPath}
		{label}
		{placeholder}
		helper-text={helperText}
		error-text={errorText}
		class:d-invalid={errorText}
		class:d-touched={errorText}
		label-placement="stacked"
		{value}
		on:dInput={(e) => {
			updateValue(e.detail);
		}}
	/>
</FieldController>
