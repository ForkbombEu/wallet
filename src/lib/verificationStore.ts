import { writable } from "svelte/store";
import type { QrToInfoResults } from "./components/organisms/scanner/tools";

export const verificationStore = writable<QrToInfoResults>();
