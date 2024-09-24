<script lang="ts">
	import type { z } from 'zod';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import { FieldController } from '$lib/forms';

	//

	type SchemaGeneric = $$Generic<AnyZodObject>;
	export let form: SuperForm<SchemaGeneric>;
	export let fieldPath: FormPathLeaves<z.infer<SchemaGeneric>>;
</script>

<div class="space-y-2">
	<FieldController {form} {fieldPath} let:errorText let:updateValue let:value>
		<d-checkbox
			name={fieldPath}
			on:dChange={(e) => updateValue(e.detail)}
			error={errorText}
			id={fieldPath}
			checked={value}
		>
			<slot />
		</d-checkbox>
	</FieldController>
</div>
