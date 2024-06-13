<script lang="ts">
	import { listOutline, pencilOutline, star } from 'ionicons/icons';
	import TEE from '$lib/nativeHooks/TEEPlugin';
	let response = 'Push the button to test native functionality';

	const callGenerateKey = async () => {
		try {
			const res = await TEE.generateKey();
			response = res.success ? `Success: ${res.result}` : `Error: ${res.error}`;
		} catch (e) {
			response = 'Error' + e;
		}
	};
	const callListAliases = async () => {
		try {
			const res = await TEE.listAliases();
			response = res.success ? `Success: ${res.result.join(',')}` : `Error: ${res.error}`;
		} catch (e) {
			response = 'Error' + e;
		}
	};
	const callEncrypt = async () => {
		try {
			const res = await TEE.doEncrypt({ msg: 'Muy bien!' });
			if (res.success) {
				const res2 = await TEE.doDecrypt({ msg: res.result });
				response = res2.success
					? `Success: ${res.result} --> ${res2.result}`
					: `Error(decrypt): ${res2.error}`;
			} else {
				response = `Error(encrypt): ${res.error}`;
			}
		} catch (e) {
			response = 'Error' + e;
		}
	};
</script>

<ion-tab tab="native">
	<ion-header translucent={true}>
		<ion-toolbar>
			<ion-buttons slot="start">
				<ion-menu-button />
			</ion-buttons>
			<ion-title>Native functions</ion-title>
		</ion-toolbar>
	</ion-header>

	<ion-content fullscreen class="ion-padding">
		<ion-Text>{response}</ion-Text>
		<ion-fab vertical="bottom" horizontal="center" slot="fixed">
			<ion-fab-button
				role="button"
				tabindex="0"
				on:click={callGenerateKey}
				on:keypress={(e) => {
					if (e.key === 'Enter') callGenerateKey();
				}}
			>
				<ion-icon icon={star} />
			</ion-fab-button>
			<ion-fab-button
				role="button"
				tabindex="0"
				on:click={callListAliases}
				on:keypress={(e) => {
					if (e.key === 'Enter') callListAliases();
				}}
			>
				<ion-icon icon={listOutline} />
			</ion-fab-button>
			<ion-fab-button
				role="button"
				tabindex="0"
				on:click={callEncrypt}
				on:keypress={(e) => {
					if (e.key === 'Enter') callEncrypt();
				}}
			>
				<ion-icon icon={pencilOutline} />
			</ion-fab-button>
		</ion-fab>
	</ion-content>
</ion-tab>
