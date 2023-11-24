<script lang="ts">
	export let value: any;
	export let updateValue: (newValue: any) => void;
	export let fieldPath: string;
	export let noDefault = false;

	function calcFieldsNumber(value: any): number {
		let count = 0;
		if (!noDefault) count += 1;
		if (Array.isArray(value) && value.length > 0) {
			count += value.length;
		}
		return count;
	}
</script>

{#each { length: calcFieldsNumber(value) } as _, index}
	{@const itemFieldPath = `${fieldPath}[${index}]`}
	{@const removeItem = () => {
		if (Array.isArray(value)) {
			const newArray = [...value];
			newArray.splice(index, 1);
			updateValue(newArray);
		}
	}}
	{@const last = index === calcFieldsNumber(value) - 1}
	<slot {index} {itemFieldPath} {removeItem} {last} />
{/each}
