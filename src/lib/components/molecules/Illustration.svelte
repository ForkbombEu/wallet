<script lang="ts">
	import bell from '$lib/assets/bell.svg?url';
	import bellDark from '$lib/assets/bell-dark.svg?url';
	import cardCloud from '$lib/assets/card-cloud.svg?url';
	import cardCloudDark from '$lib/assets/card-cloud-dark.svg?url';
	import cards from '$lib/assets/cards.svg?url';
	import cardsDark from '$lib/assets/cards-dark.svg?url';
	import chat from '$lib/assets/chat.svg?url';
	import chatDark from '$lib/assets/chat-dark.svg?url';
	import handCard from '$lib/assets/hand-card.svg?url';
	import handCardDark from '$lib/assets/hand-card-dark.svg?url';
	import handEllipsis from '$lib/assets/hand-ellipsis.svg?url';
	import handEllipsisDark from '$lib/assets/hand-ellipsis-dark.svg?url';
	import logoHand from '$lib/assets/logo-hand.svg?url';
	import logoHandDark from '$lib/assets/logo-hand-dark.svg?url';
	import pidgeon from '$lib/assets/pidgeon.svg?url';
	import pidgeonDark from '$lib/assets/pidgeon-dark.svg?url';
	import search from '$lib/assets/search.svg?url';
	import searchDark from '$lib/assets/search-dark.svg?url';
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
</script>

{#if img === 'bell'}
	<img src={isDark ? bellDark : bell} alt={img} class="absolute top-0 w-full" />
{:else if img === 'card-cloud'}
	<img src={isDark ? cardCloudDark : cardCloud} alt={img} class="absolute top-0 w-full" />
{:else if img === 'cards'}
	<img src={isDark ? cardsDark : cards} alt={img} class="absolute top-0 w-full" />
{:else if img === 'chat'}
	<img src={isDark ? chatDark : chat} alt={img} class="absolute top-0 w-full" />
{:else if img === 'hand-card'}
	<img src={isDark ? handCardDark : handCard} alt={img} class="absolute top-0 w-full" />
{:else if img === 'hand-ellipsis'}
	<img src={isDark ? handEllipsisDark : handEllipsis} alt={img} class="absolute top-0 w-full" />
{:else if img === 'logo-hand'}
	<img src={isDark ? logoHandDark : logoHand} alt={img} class="absolute top-0 w-full" />
{:else if img === 'pidgeon'}
	<img src={isDark ? pidgeonDark : pidgeon} alt={img} class="absolute top-0 w-full" />
{:else if img === 'search'}
	<img src={isDark ? searchDark : search} alt={img} class="absolute top-0 w-full" />
{:else}
	<img src={isDark ? pidgeonDark : pidgeon} alt={img} class="absolute top-0 w-full" />
{/if}
