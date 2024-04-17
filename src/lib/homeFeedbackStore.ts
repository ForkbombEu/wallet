import { writable } from "svelte/store";
import type { Feedback } from "./utils/types";

export const homeFeedbackStore = writable<Feedback>();
