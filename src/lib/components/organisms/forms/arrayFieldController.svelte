<script lang="ts">
	import { cloneDeep } from 'lodash';

	export let value: any | undefined;
	export let updateValue: (newValue: any) => void;
	export let fieldPath: string;

	//

	$: itemCount = countItems(value);

	function countItems(v: typeof value): number {
		if (Array.isArray(v)) return v.length;
		else return 0;
	}

	//

	let inputCount = countItems(value);
	$: resetInputCount(value);

	function resetInputCount(v: typeof value) {
		inputCount = countItems(v);
	}

	//

	$: canAdd = inputCount == itemCount;

	function addItem() {
		if (canAdd) inputCount += 1;
	}
</script>

<slot name="before-items" {addItem} {canAdd} />

{#each { length: inputCount } as _, index}
	{@const itemFieldPath = `${fieldPath}[${index}]`}
	{@const isLast = index === inputCount - 1}
	{@const removeItem = () => {
		if (Array.isArray(value) && Boolean(value.at(index))) {
			const newArray = cloneDeep(value);
			newArray.splice(index, 1);
			updateValue(newArray);
		} else {
			resetInputCount(value);
		}
	}}
	<slot name="item" {index} {itemFieldPath} {removeItem} {isLast} />
{/each}

<slot name="after-items" {addItem} {canAdd} />
