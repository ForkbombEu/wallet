<script lang="ts">
	import FieldError, { fieldHasErrors } from './fieldError.svelte';

	import { cameraOutline } from 'ionicons/icons';
	import { Camera, CameraResultType } from '@capacitor/camera';
	import type { z } from 'zod';
	import type { FormPath, ZodValidation } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';
	import { createEventDispatcher } from 'svelte';
	import { m } from '$lib/i18n';

	const dispatch = createEventDispatcher();

	type T = $$Generic<AnyZodObject>;

	export let form: SuperForm<ZodValidation<T>, any>;
	export let field: FormPath<z.infer<T>>;

	const { validate } = form;
	const { errors } = formFieldProxy(form, field);

	$: hasErrors = fieldHasErrors($errors);

	//

	let choosenFile: string;
	let choosenFileFile: File;
	let choosenFileDataURL: string;

	const b64toBlob = (b64Data: string, contentType = '', sliceSize = 512) => {
		const byteCharacters = atob(b64Data);
		const byteArrays = [];

		for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
			const slice = byteCharacters.slice(offset, offset + sliceSize);

			const byteNumbers = new Array(slice.length);
			for (let i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}

			const byteArray = new Uint8Array(byteNumbers);
			byteArrays.push(byteArray);
		}

		const blob = new Blob(byteArrays, { type: contentType });
		return blob;
	};

	const takePicture = async () => {
		const image = await Camera.getPhoto({
			quality: 50,
			allowEditing: false,
			resultType: CameraResultType.Base64
		});
		if (!image) return;

		const blob = b64toBlob(image.base64String!, image.format);

		choosenFile = `avatar.${image.format}`;
		choosenFileFile = new File([blob], choosenFile, { type: `image/${blob.type}` });
		choosenFileDataURL = `data:image/${image.format};base64,${image.base64String}`;
		//@ts-ignore
		await validate(field as any, { value: choosenFileFile, taint: true });
		dispatch('change', { image: choosenFileDataURL });
	};
</script>

<div>
	<d-horizontal-stack class="w-full items-center" gap={4}>
		<d-button on:click={takePicture} on:keydown={takePicture} aria-hidden expand class="w-full pt-1"
			><ion-icon
				icon={cameraOutline}
				slot="start"
				class="h-6 w-6"
			/>{m.upload_a_picture()}</d-button
		>
	</d-horizontal-stack>
	{#if hasErrors}
		<FieldError {form} {field} />
	{/if}
</div>
