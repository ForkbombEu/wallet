<script lang="ts">
	export let label: string | undefined = undefined
	export let name: string;
	export let helperText: string | undefined = undefined;
	export let type: 'email' | 'text' = 'text';
    export let form:any
    export let errors:any
    export let checkInput:any
</script>

<ion-item class="ion-no-border">
	<ion-input
		{type}
		{name}
        class:ion-invalid={$errors[name]}
        class:ion-touched={$errors[name]}
        label={label}
        label-placement="stacked"
        helper-text={helperText}
        error-text={$errors[name]}
        value={$form[name]}
        on:ionInput={checkInput} />
</ion-item>
