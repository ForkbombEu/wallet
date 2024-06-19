import {sequence} from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import { i18n } from '$lib/i18n';

Sentry.init({
    dsn: "https://1cd700658ca433e210cb088b88a8bf46@o4507426078982144.ingest.de.sentry.io/4507426079375440",
    tracesSampleRate: 1
})

export const handle = sequence(Sentry.sentryHandle(), i18n.handle());
export const handleError = Sentry.handleErrorWithSentry();