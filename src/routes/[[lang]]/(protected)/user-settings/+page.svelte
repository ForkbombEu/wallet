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
		email: z.string().email().optional(),
		emailVisibility: z.boolean().optional(),
		avatar: zodFile({ types: ['image/png', 'image/jpeg'], size: 1024 * 1024 * 2 }).optional()
	});

	const initialData: Partial<z.infer<typeof schema>> = {
		name: user!.name,
		email: user!.email,
		emailVisibility: user!.emailVisibility
	};

	const form = createForm({
		schema,
		onSubmit: async ({ form }) => {
			console.log(form);
			try {
				loading = true;
				const slangroom = new Slangroom(pocketbase);
				const data = {
					pb_address: backendUri,
					update_parameters: {
						id: user!.id,
						collection: 'users',
						record: {
							name: form.data.name || null,
							email: form.data.email || null,
							emailVisibility: form.data.emailVisibility || null,
							avatar: choosenAvatarFile || null
						}
					},
					record_parameters: {}
				};
				//@ts-ignore
				const res = await slangroom.execute(update, { data });
				console.log(res);
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
	let email = form.fields.email?.value;
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
			<d-heading size="xs" class="w-full">{$email || user?.email}</d-heading>
		</d-vertical-stack>
	</d-horizontal-stack>
	<hr />
	<Form {form} formClass="flex flex-col gap-4 pb-6 pt-4 w-full">
		<d-horizontal-stack class="w-full">
			<d-button on:click={chooseImage}>pick one image</d-button>
			<d-input name="avatar" value={choosenAvatar}></d-input>
		</d-horizontal-stack>
		<Input
			{form}
			fieldPath="email"
			placeholder={m.emailexample_com()}
			label={m.Email()}
			type="email"
		/>
		<Input {form} fieldPath="name" placeholder={'m.John_Doe()'} label={'m.Name()'} type="text" />
		<d-button size="default" color="accent" type="submit" expand class="mt-4">
			{'save'}
		</d-button>
	</Form>
</div>
