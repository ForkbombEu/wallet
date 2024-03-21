<script lang="ts">
	import bell from '$lib/assets/bell.svg';
	import bellDark from '$lib/assets/bell-dark.svg';
	import cardCloud from '$lib/assets/card-cloud.svg';
	import cardCloudDark from '$lib/assets/card-cloud-dark.svg';
	import cards from '$lib/assets/cards.svg';
	import cardsDark from '$lib/assets/cards-dark.svg';
	import chat from '$lib/assets/chat.svg';
	import chatDark from '$lib/assets/chat-dark.svg';
	import handCard from '$lib/assets/hand-card.svg';
	import handCardDark from '$lib/assets/hand-card-dark.svg';
	import handEllipsis from '$lib/assets/hand-ellipsis.svg';
	import handEllipsisDark from '$lib/assets/hand-ellipsis-dark.svg';
	import logoHand from '$lib/assets/logo-hand.svg';
	import logoHandDark from '$lib/assets/logo-hand-dark.svg';
	import pidgeon from '$lib/assets/pidgeon.svg';
	import pidgeonDark from '$lib/assets/pidgeon-dark.svg';
	import search from '$lib/assets/search.svg';
	import searchDark from '$lib/assets/search-dark.svg';
	import { isDark } from '$lib/isDark';

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
		isDark ? '-dark' : '';
</script>

<div class="absolute top-0 w-full">
	<img src={`/src/lib/assets/${img}${suffix}.svg`} alt={img} class="mx-auto w-96" />
</div>
