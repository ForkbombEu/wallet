<script lang="ts">
	import { r } from '$lib/i18n';
	import { qrCode } from 'ionicons/icons';
</script>

<ion-fab-button href={r('/scan')}>
	<ion-icon icon={qrCode} translucent />
</ion-fab-button>

<style lang="postcss">
	ion-fab-button {
		--border-radius: 10%;
		opacity: 0.8;
		position: fixed;
		right: 20px;
		bottom: 40px;
	}
</style>
