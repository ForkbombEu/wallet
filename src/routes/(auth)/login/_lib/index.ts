import { writable } from 'svelte/store';
export const userEmailStore = writable<string | undefined>();
