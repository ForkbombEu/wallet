<script lang="ts">
	import TabPage from '$lib/components/organisms/TabPage.svelte';
	import Credential from '$lib/components/molecules/Credential.svelte';
	import { generateKeyring } from '$lib/zencodes';
	import ScanButton from '$lib/components/molecules/ScanButton.svelte';
</script>

<TabPage tabId="wallet" title="Your Credentials">
	<Credential action="+"/>
	<ScanButton/>
</TabPage>
