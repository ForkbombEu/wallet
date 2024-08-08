<!-- <script lang="ts" context="module">
	export type IllustrationImg =
		| 'bell'
		| 'card-cloud'
		| 'cards'
		| 'chat'
		| 'hand-card'
		| 'hand-ellipsis'
		| 'logo-hand'
		| 'pidgeon'
		| 'search';
</script> -->

<script lang="ts">
	export let background: string;
</script>

<d-illustration {background}>
	<slot />
</d-illustration>
