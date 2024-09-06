<script lang="ts">
	import { createForm, Form, Input } from '$lib/forms';
	import { z } from 'zod';
	import HeaderWithBackButton from '$lib/components/molecules/HeaderWithBackButton.svelte';
	import FingerPrint from '$lib/assets/lottieFingerPrint/FingerPrint.svelte';
	import { m } from '$lib/i18n';
	import { FilePicker } from '@capawesome/capacitor-file-picker';
	import { authFilesUri, backendUri } from '$lib/backendUri';
	import { Slangroom } from '@slangroom/core';
	import { pocketbase } from '@slangroom/pocketbase';
	import update from '$lib/slangroom/update.slang?raw';
	import { cameraOutline } from 'ionicons/icons';
	import { Camera, CameraResultType } from '@capacitor/camera';

	const b64toBlob = (b64Data:string, contentType = '', sliceSize = 512) => {
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

		choosenAvatar = `avatar.${image.format}`;
		choosenAvatarFile = new File([blob], choosenAvatar);
		choosenAvatarDataURL = image.dataUrl!;
	};

	export let data;
	const { user } = data;

	let loading = false;

	type ZodFileOptions = {
		types?: string[];
		size?: number;
	};

	function zodFile(options: ZodFileOptions = {}) {
		const { size, types } = options;

		let schema = z.instanceof(File);

		if (size) {
			schema = schema.refine((v) => v.size < size, `File size exceeds ${size} bytes`);
		}
		if (types) {
			schema = schema.refine((v) => types.includes(v.type), `File type not: ${types.join(', ')}`);
		}

		return schema;
	}

	const schema = z.object({
		name: z.string().min(3).optional(),
		avatar: zodFile({ types: ['image/png', 'image/jpeg'], size: 1024 * 1024 * 20 }).optional()
	});

	const initialData: Partial<z.infer<typeof schema>> = {
		name: user!.name,
	};

	const form = createForm({
		schema,
		onSubmit: async ({ form }) => {
			try {
				loading = true;
				const slangroom = new Slangroom(pocketbase);
				const record: Record<string, any> = {};
				record.name = form.data.name;
				record.avatar = choosenAvatarFile;
				const data = {
					pb_address: backendUri,
					update_parameters: {
						id: user!.id,
						collection: 'users',
						record
					},
					record_parameters: {}
				};
				await slangroom.execute(update, { data });
				// await invalidate(_userSettingsKey)
				// await invalidateAll()
				loading = false;
			} catch (error) {}
		},
		initialData
	});

	let choosenAvatar: string | undefined;
	let choosenAvatarFile: File | undefined;
	let choosenAvatarDataURL: string | ArrayBuffer | null;

	const chooseImage = async () => {
		const image = await FilePicker.pickImages();
		console.log(image);
		choosenAvatar = image.files[0].name;
		choosenAvatarFile = image.files[0].blob && new File([image.files[0].blob], image.files[0].name);
	};

	$: if (choosenAvatarFile) {
		const fr = new FileReader();
		fr.onload = function () {
			choosenAvatarDataURL = fr.result;
		};
		fr.readAsDataURL(choosenAvatarFile);
	}
	let name = form.fields.name?.value;
</script>

<HeaderWithBackButton>User Settings</HeaderWithBackButton>
<d-loading {loading}>
	<FingerPrint />
</d-loading>

<div class="ion-padding flex w-full flex-col items-center gap-6">
	<d-horizontal-stack class="w-full">
		<d-avatar src={choosenAvatarDataURL || authFilesUri(user?.avatar, user?.id)} size="xl"
		></d-avatar>
		<d-vertical-stack>
			<d-heading size="xs" class="w-full">{$name || user?.name}</d-heading>
			<d-heading size="xs" class="w-full"
				>{user?.email}</d-heading
			>
		</d-vertical-stack>
	</d-horizontal-stack>
	<hr />
	<Form {form} formClass="flex flex-col gap-4 pb-6 pt-4 w-full">
		<d-horizontal-stack class="w-full items-stretch" gap={0}>
			<d-button on:click={takePicture} class="pt-1"
				><ion-icon icon={cameraOutline} slot="icon-only" class="py-2" /></d-button
			>
			<d-input name="avatar" value={choosenAvatar || user?.avatar} class="w-full"></d-input>
		</d-horizontal-stack>
		<Input {form} fieldPath="name" placeholder={m.John_Doe()} label={m.username()} type="text" />
		<d-button size="default" color="accent" type="submit" expand class="mt-4">
			{m.save()}
		</d-button>
	</Form>
</div>
