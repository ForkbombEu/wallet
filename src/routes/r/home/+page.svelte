<script lang="ts">
	import Credential from '$lib/components/molecules/Credential.svelte';
	import ScanButton from '$lib/components/molecules/ScanButton.svelte';
	import TabPage from '$lib/components/organisms/TabPage.svelte';
	import { qrCode } from 'ionicons/icons';
</script>

<TabPage tabId="home" title="Available claims">
	<Credential action="+"/>
	<ScanButton/>
</TabPage>
