import { m, r } from '$lib/i18n';

export const Tabs = {
	home: 'home',
	wallet: 'wallet',
	activity: 'activity',
	profile: 'profile'
} as const;

export type Tab = (typeof Tabs)[keyof typeof Tabs];

//

export type TabProps = {
	label: string;
	tab: Tab;
	hasAlert?: boolean;
};

export const scanButton = {
	'scan-button-text': m.SCAN_QR(),
	'scan-button-href': r('/scan')
};

//
