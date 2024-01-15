<script lang="ts">
	import { goto } from '$app/navigation';
	import { qrCode } from 'ionicons/icons';
</script>

<ion-fab-button>
	<ion-icon icon={qrCode} on:click={() => goto('/r/scan')} class="nob" translucent/>
</ion-fab-button>

<style lang="postcss">
	ion-fab-button {
        --border-radius:10%;
        position: absolute;
        right:20px;
        bottom: 80px;
	}
</style>
