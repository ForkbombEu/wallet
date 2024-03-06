<script lang="ts">
	import vector from '$lib/assets/Vector.png';
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

<div
	class="flex h-64 w-full flex-col items-center justify-end bg-cover bg-no-repeat"
	style={`background-image:url(${vector})`}
>
	<img src={`/src/lib/assets/${img}${suffix}.svg`} alt={img} class="w-92" />
</div>
