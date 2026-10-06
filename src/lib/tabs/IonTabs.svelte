<script lang="ts">
	import { page } from '$app/stores';
	import { goto, m, r } from '$lib/i18n';
	import type { TabProps } from '.';

	export let tabs: TabProps[] = [];

	$: currentTabName = tabs.find(({ tab }) => $page.url.pathname.split('/').includes(tab))?.tab;

	const activateTab = (event: MouseEvent, tab: string) => {
		if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
		event.preventDefault();
		void goto('/' + tab);
	};

	const focusAdjacentTab = (event: KeyboardEvent, index: number) => {
		if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
		event.preventDefault();
		const next =
			event.key === 'Home'
				? 0
				: event.key === 'End'
					? tabs.length - 1
					: (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
		const bar = (event.currentTarget as HTMLElement).parentElement;
		const tab = bar?.querySelectorAll<HTMLElement & { focusTab(): Promise<void> }>('d-tab-button')[
			next
		];
		void tab?.focusTab();
	};
</script>

<ion-tabs>
	<slot />
	<nav slot="bottom" aria-label={m.Main_navigation()}>
		<ion-tab-bar class="flex justify-between px-2" aria-label={m.Main_navigation()}>
			{#each tabs as { tab, hasAlert, label }, index}
				<d-tab-button
					{tab}
					href={r('/' + tab)}
					accessible-label={hasAlert ? m.Navigation_with_updates({ label }) : label}
					on:click={(event: MouseEvent) => activateTab(event, tab)}
					on:keydown={(event: KeyboardEvent) => focusAdjacentTab(event, index)}
					active={currentTabName === tab}
					has-alert={hasAlert}
					focus-index={currentTabName === tab || (!currentTabName && index === 0) ? 0 : -1}
				>
					{label}
				</d-tab-button>
			{/each}
		</ion-tab-bar>
	</nav>
</ion-tabs>
