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

<div class="relative">
	<img
		src={background}
		class="max-h-[50vh] w-full shrink-0 fill-highlight opacity-50"
		alt="background"
	/>
	<div class="absolute bottom-[-30px] w-full">
		<div class="mx-auto w-fit max-w-96">
		<slot />
		</div>
	</div>
</div>
