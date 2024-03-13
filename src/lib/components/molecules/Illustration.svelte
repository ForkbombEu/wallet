<script lang="ts">
	export let img:
		| 'bell'
		| 'card-cloud'
		| 'cards'
		| 'chat'
		| 'hand-card'
		| 'hand-ellipsis'
		| 'logo-hand'
		| 'pidgeon'
		| 'search';
	const suffix =
		window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? '-dark' : '';
</script>

<div class="absolute top-0 w-full">
	<img src={`/src/lib/assets/${img}${suffix}.svg`} alt={img} class="mx-auto w-96" />
</div>
