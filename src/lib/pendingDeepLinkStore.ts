import { writable } from "svelte/store";

export const pendingDeepLink  = writable<string | null>(null);
