import * as Sentry from '@sentry/sveltekit';

Sentry.init({
	dsn: 'https://f806b732dba19a52cc1e1539570d76b0@o538041.ingest.sentry.io/4506421221130240',

	tracesSampleRate: 0.3,

	// Optional: Initialize Session Replay:
	integrations: [new Sentry.Replay()],
	replaysSessionSampleRate: 0.1,
	replaysOnErrorSampleRate: 1.0
});

export const handleError = Sentry.handleErrorWithSentry();
