export const Tabs = {
	home: 'home',
	wallet: 'wallet',
	activity: 'activity',
	profile: 'profile'
} as const;

export type Tab = (typeof Tabs)[keyof typeof Tabs];

//

export type IonTabProps = {
	label: string;
	tab: Tab;
	hasAlert?:boolean;
};

//

import TabPage from './TabPage.svelte';
export { TabPage };
