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
	import Checkbox from '$lib/forms/checkbox.svelte';
	import { cameraOutline, cloudUploadOutline } from 'ionicons/icons';
	// import { invalidate, invalidateAll } from '$app/navigation';
	// import { _userSettingsKey } from './+page.js';

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
		emailVisibility: z.boolean().optional(),
		avatar: zodFile({ types: ['image/png', 'image/jpeg'], size: 1024 * 1024 * 2 }).optional()
	});

	const initialData: Partial<z.infer<typeof schema>> = {
		name: user!.name,
		emailVisibility: user!.emailVisibility
	};

	const form = createForm({
		schema,
		onSubmit: async ({ form }) => {
			try {
				loading = true;
				const slangroom = new Slangroom(pocketbase);
				const record: Record<string, any> = {};
				record.name = form.data.name;
				record.emailVisibility = form.data.emailVisibility;
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
				>{user?.email} ({data.user?.emailVisibility ? m.public_email() : m.not_public()})</d-heading
			>
		</d-vertical-stack>
	</d-horizontal-stack>
	<hr />
	<Form {form} formClass="flex flex-col gap-4 pb-6 pt-4 w-full">
		<d-horizontal-stack class="w-full items-stretch" gap={0}>
			<d-button on:click={chooseImage} class="pt-1"
				><ion-icon icon={cloudUploadOutline} slot="icon-only" class="py-2"/></d-button
			>
			<d-button on:click={chooseImage} class="pt-1"
				><ion-icon icon={cameraOutline} slot="icon-only" class="py-2"/></d-button
			>
			<d-input name="avatar" value={choosenAvatar || user?.avatar} class="w-full"></d-input>
		</d-horizontal-stack>
		<Checkbox {form} fieldPath="emailVisibility">{m.public_email()}</Checkbox>
		<Input {form} fieldPath="name" placeholder={m.John_Doe()} label={m.username()} type="text" />
		<d-button size="default" color="accent" type="submit" expand class="mt-4">
			{m.save()}
		</d-button>
	</Form>
</div>
