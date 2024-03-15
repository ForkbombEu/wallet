<script lang="ts">
	import { m, r } from '$lib/i18n';
	import { qrCode } from 'ionicons/icons';
</script>

<d-button href={r('/scan')} color="accent" size="large" class="shadow-xl">
	<ion-icon icon={qrCode} slot="start" />
	{m.SCAN_QR()}
</d-button>

<style lang="postcss">
	d-button {
		--border-radius: 10%;
		opacity: 0.8;
		position: fixed;
		right: 20px;
		bottom: 40px;
	}
</style>
