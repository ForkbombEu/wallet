<script lang="ts" context="module">
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
</script>

<script lang="ts">
	// import bell from '$lib/assets/bell.svg?url';
	// import cardCloud from '$lib/assets/card-cloud.svg?url';
	// import cards from '$lib/assets/cards.svg?url';
	// import chat from '$lib/assets/chat.svg?url';
	// import handCard from '$lib/assets/hand-card.svg?url';
	// import handEllipsis from '$lib/assets/hand-ellipsis.svg?url';
	// import logoHand from '$lib/assets/logo-hand.svg?url';
	// import pidgeon from '$lib/assets/pidgeon.svg?url';
	// import search from '$lib/assets/search.svg?url';
	import Bell from '$lib/assets/bell.svelte';
	import CardCloud from '$lib/assets/CardCloud.svelte';
	import Cards from '$lib/assets/Cards.svelte';
	import Chat from '$lib/assets/Chat.svelte';
	import HandCard from '$lib/assets/HandCard.svelte';
	import HandEllipsis from '$lib/assets/HandEllipsis.svelte';
	import LogoHand from '$lib/assets/LogoHand.svelte';
	import Pidgeon from '$lib/assets/Pidgeon.svelte';
	import Search from '$lib/assets/Search.svelte';

	export let img: IllustrationImg;
	export let background: string;

	const imgClass = 'mx-auto w-full max-w-96';
</script>

<div class="relative">
	<img
		src={background}
		class="max-h-[50vh] w-full shrink-0 fill-highlight opacity-50"
		alt="background"
	/>
	<div class="absolute top-0 w-full">
		<slot/>
	</div>
</div>
