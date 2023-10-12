<script lang="ts">
	import { goto } from "$app/navigation";
	import { removePreference } from "$lib/preferences/prefereces";

    const logout = ()=> {
        removePreference("keyring")
        goto('/login')
    }
</script>
<ion-tab tab="logout">
    <ion-button on:click={logout}>Logout</ion-button>
</ion-tab>