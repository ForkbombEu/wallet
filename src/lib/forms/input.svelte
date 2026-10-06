<script lang="ts">
	import type { z } from 'zod';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import { FieldController } from '$lib/forms';
	import { m } from '$lib/i18n';

	//

	type SchemaGeneric = $$Generic<AnyZodObject>;
	export let form: SuperForm<z.infer<SchemaGeneric>>;
	export let fieldPath: FormPathLeaves<z.infer<SchemaGeneric>>;
	export let hidable = false;

	export let type: 'email' | 'text' | 'password' = 'text';
	export let label: string | undefined = undefined;
	export let helperText: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;
	export let autocomplete = 'off';
	export let autocapitalize = 'none';
	export let spellcheck = false;
	export let disabled = false;
</script>

<FieldController {form} {fieldPath} let:value let:errorText let:updateValue>
	<d-input
		{type}
		id={fieldPath}
		name={fieldPath}
		{label}
		{placeholder}
		helper-text={helperText}
		error-text={errorText}
		class:d-invalid={errorText}
		class:d-touched={errorText}
		label-placement="stacked"
		{value}
		{hidable}
		{autocomplete}
		{autocapitalize}
		{spellcheck}
		{disabled}
		show-password-label={m.Show_password()}
		hide-password-label={m.Hide_password()}
		clear-label={m.Clear_input()}
		on:dInput={(e: CustomEvent<string>) => {
			updateValue(e.detail);
		}}><slot /></d-input
	>
</FieldController>
