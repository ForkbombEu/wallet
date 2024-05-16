import { writable } from 'svelte/store';
import type { Service } from './components/organisms/scanner/tools';

export const credentialOfferStore = writable<Service>();
