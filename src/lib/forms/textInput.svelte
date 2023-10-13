<script lang="ts">
	export let label: string | undefined = undefined;
	export let name: string;
	export let helperText: string | undefined = undefined;
	export let type: 'email' | 'text' = 'text';
	export let form: any; //  Writable<SuperForm<UserAnswersZod>>
	export let errors: any; // Writable<ValidationErrors<>>
	const onInput = (
		e: CustomEvent & {
			target: HTMLIonInputElement;
		}
	) => {
		if (e.target.name in $form) {
			$form[e.target.name] = e.detail.value;
		}
	};
</script>

<ion-item class="ion-no-border">
	<ion-input
		{type}
		{name}
		class:ion-invalid={$errors[name]}
		class:ion-touched={$errors[name]}
		{label}
		label-placement="stacked"
		helper-text={helperText}
		error-text={$errors[name]}
		value={$form[name]}
		on:ionInput={onInput}
	/>
</ion-item>
