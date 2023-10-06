<script lang="ts">
	import { phonePortrait } from "ionicons/icons";
    import Echo from '$lib/nativeHooks/EchoPlugin';
    let response= "Push the button to test native functionality"
    const callNativeCode = async ()=> {
    const { value } = await Echo.echo({ value: 'Hello From your phone!' });
        response = value
    }
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
				on:click={callNativeCode}
				on:keypress={(e) => {
					if (e.key === 'Enter') callNativeCode();
				}}
			>
				<ion-icon icon={phonePortrait} />
			</ion-fab-button>
		</ion-fab>
	</ion-content>
</ion-tab>
