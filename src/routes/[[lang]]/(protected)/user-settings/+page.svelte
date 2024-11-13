<script lang="ts">
	import { createForm, Form, Input, zodFile } from '$lib/forms';
	import { z } from 'zod';
	import HeaderWithBackButton from '$lib/components/molecules/HeaderWithBackButton.svelte';
	import FingerPrint from '$lib/assets/lottieFingerPrint/FingerPrint.svelte';
	import { m } from '$lib/i18n';
	import { authFilesUri, backendUri } from '$lib/backendUri';
	import { Slangroom } from '@slangroom/core';
	import { pocketbase } from '@slangroom/pocketbase';
	import update from '$lib/slangroom/update.slang?raw';
	import FileInput from '$lib/forms/fileInput.svelte';
	import { goto } from '$app/navigation';

	export let data;
	const { user } = data;

	let loading = false;

	const schema = z.object({
		name: z.string().min(3).optional(),
		avatar: zodFile({ types: ['image/png', 'image/jpeg'], size: 1024 * 1024 * 20 }).optional()
	});

	const initialData: Partial<z.infer<typeof schema>> = {
		name: user!.name
	};

	const form = createForm({
		schema,
		onSubmit: async ({ form }) => {
			try {
				loading = true;
				const slangroom = new Slangroom(pocketbase);
				const record: Record<string, any> = {};
				record.name = form.data.name;
				console.log(form.data.avatar);
				record.avatar = form.data.avatar;
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
				loading = false;
			} catch (error) {}
		},
		initialData
	});

	let choosenAvatarFile: File | undefined;
	let choosenAvatarDataURL: string | ArrayBuffer | null;

	$: if (choosenAvatarFile) {
		const fr = new FileReader();
		fr.onload = function () {
			choosenAvatarDataURL = fr.result;
		};
		fr.readAsDataURL(choosenAvatarFile);
	}
	let name = form.fields.name?.value;

	const handleAvatarChange = (e: { detail: { image: string | ArrayBuffer | null } }) => {
		console.log(e.detail);
		choosenAvatarDataURL = e.detail.image;
	};
</script>

<HeaderWithBackButton>{m.User_Settings()}</HeaderWithBackButton>
<d-loading {loading}>
	<FingerPrint />
</d-loading>

<div class="ion-padding flex w-full flex-col items-center gap-6">
	<d-horizontal-stack class="w-full">
		<d-avatar src={choosenAvatarDataURL || authFilesUri(user?.avatar, user?.id)} size="xl"
		></d-avatar>
		<d-vertical-stack>
			<d-heading size="xs" class="w-full">{$name || user?.name}</d-heading>
			<d-heading size="xs" class="w-full">{user?.email}</d-heading>
		</d-vertical-stack>
	</d-horizontal-stack>
	<hr />
	<Form {form} formClass="flex flex-col gap-4 pb-6 pt-4 w-full">
		<FileInput {form} field="avatar" on:change={handleAvatarChange} label={m.avatar()} />
		<Input {form} fieldPath="name" placeholder={m.John_Doe()} label={m.username()} type="text" />
		<d-vertical-stack>
			<d-button color="accent" type="submit" expand class="mt-4">
				{m.save()}
			</d-button>
			<d-button expand on:click={() => goto('/profile')} aria-hidden>
				{m.cancel()}
			</d-button>
		</d-vertical-stack>
	</Form>
</div>
