<script lang="ts">
	import { cloneDeep } from 'lodash';

	export let value: any | undefined;
	export let updateValue: (newValue: any) => void;
	export let fieldPath: string;
	export let noFirstDefault = false;

	//

	let valuesCount = 0;
	$: valuesCount = getValueLength(value);

	function getValueLength(v: typeof value): number {
		if (Array.isArray(v)) return v.length;
		else return 0;
	}

	//

	let inputsCount = setupInputsCount(valuesCount);
	$: inputsCount = updateInputsCount(valuesCount);

	function setupInputsCount(valuesCount: number) {
		if (valuesCount === 0 && !noFirstDefault) return 1;
		else return valuesCount;
	}

	function updateInputsCount(valuesCount: number) {
		if (inputsCount == 1) return 1;
		else return valuesCount;
	}

	//

	$: canAdd = inputsCount == valuesCount;

	function addItem() {
		if (canAdd) inputsCount += 1;
	}

	function createRemoveItem(index: number): () => void {
		if (Array.isArray(value) && Boolean(value.at(index))) {
			return () => {
				const newArray = cloneDeep(value);
				newArray.splice(index, 1);
				updateValue(newArray);
			};
		} else {
			return () => {
				inputsCount -= 1;
			};
		}
	}
</script>

<slot name="before-items" {addItem} {canAdd} />

{#each { length: inputsCount } as _, index}
	{@const itemFieldPath = `${fieldPath}[${index}]`}
	{@const isLast = index === inputsCount - 1}
	{@const removeItem = createRemoveItem(index)}
	<slot name="item" {index} {itemFieldPath} {removeItem} {isLast} />
{/each}

<slot name="after-items" {addItem} {canAdd} />
