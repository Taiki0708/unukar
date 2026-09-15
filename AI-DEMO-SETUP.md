# Voice analysis demo

Set `OPENAI_API_KEY` in Vercel → unukar → Settings → Environment Variables for Production, then redeploy. Keep the value secret; never put it in the repository or a NEXT_PUBLIC variable. Use a dedicated OpenAI project with limited model access and a small budget; budget alerts are not a hard spending cap.

The demo sends only audio and the browser's recording date to `/api/memory`. The server transcribes with `gpt-4o-mini-transcribe`, then extracts optional fields with `gpt-4.1-mini`. No photo is sent. No application database or permanent file storage is used. OpenAI's own data retention policies still apply.

Before broadly sharing, configure a Vercel Firewall rate limit for `/api/memory`. The code's five attempts per IP per hour throttle is instance-local and resets across cold starts; it is not a deployment-wide spend limit. Recordings are limited to 30 seconds in the UI and 3 MB on the server. Analysis requests have timeouts and are never automatically retried.

Without a key the endpoint returns a clear 503 message and keeps the recording in the browser. The example uses explicitly labeled prepared details and does not call AI.

Validation: production build and mocked route tests cover missing configuration, cross-origin rejection, Japanese transcript passthrough, extraction, partial provider failures and throttling. Live transcription accuracy requires the configured API and a real voice test. Test Japanese and English notes, silence, unknown names, relative dates and recommendations versus actual travel before broad release.

References: https://developers.openai.com/api/docs/guides/speech-to-text and https://developers.openai.com/api/docs/guides/structured-outputs
