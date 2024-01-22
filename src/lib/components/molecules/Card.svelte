<script lang="ts">
	export let content:string = "you looser";
	export let title:string = "You have nothing";

</script>
<div class="card">
	<div class="text-right"><slot/></div>
	<br />
	<span class="c-title">{title}</span>
	<br />
	<span class="c-content">{content}</span>
</div>

<style lang="postcss">
	.card {
		@apply shrink-0 rounded-xl p-10;
		background:
			linear-gradient(0deg, rgba(31, 42, 55, 0.6) 0%, rgba(31, 42, 55, 0.6) 100%),
			linear-gradient(0deg, rgba(84, 67, 167, 0.2) 0%, rgba(84, 67, 167, 0.2) 100%),
			url(/Rectangle.png),
			lightgray 50% / cover no-repeat;
		background-size: cover;
		background-repeat: no-repeat;
	}
	.c-title {
		@apply text-base font-medium not-italic leading-[20.5px] tracking-[-0.5px] text-[#EFEFEF];
	}

	.c-content {
		@apply text-xs font-medium not-italic leading-[20.5px] tracking-[-0.5px] text-[#E8D2FF];
	}
</style>
