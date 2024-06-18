import * as Sentry from '@sentry/sveltekit';
import { log } from '$lib/log';
import { lockApp } from '$lib/preferences/locked';
import type { HandleClientError } from '@sveltejs/kit';

// If you don't want to use Session Replay, remove the `Replay` integration, 
// `replaysSessionSampleRate` and `replaysOnErrorSampleRate` options.
Sentry.init({
    dsn: "https://1cd700658ca433e210cb088b88a8bf46@o4507426078982144.ingest.de.sentry.io/4507426079375440",
    tracesSampleRate: 1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    integrations: [Sentry.replayIntegration()]
})

lockApp();

export const handleError: HandleClientError = Sentry.handleErrorWithSentry(async ({ error, event, status, message }) => {
	await log(String(error))
    await log(JSON.stringify(event))
    await log(JSON.stringify(status));
    await log(message)

	return {
		message,
		status,
		event,
		error
	};
});