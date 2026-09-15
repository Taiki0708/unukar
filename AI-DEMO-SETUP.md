# Gemini voice analysis demo

1. Sign in to https://aistudio.google.com/apikey and create an API key in a free-tier project. Do not enable Cloud Billing for this free trial setup. Availability and quotas depend on account and region.
2. Add `GEMINI_API_KEY` in Vercel → unukar → Settings → Environment Variables for Production, then redeploy. Never put the key in chat, GitHub or a NEXT_PUBLIC variable.
3. Test a short, non-sensitive recording. Free-tier inputs may be used by Google to improve its products. The demo displays this disclosure before submission.

The server sends only audio and the browser's recording date to Gemini 2.5 Flash via generateContent. One request returns the original-language transcript and optional details. The original audio remains in browser memory. No photo is sent and no application database or permanent file storage is used. Google's own retention policies still apply.

Quota errors return a clear message; there is no automatic retry, provider fallback or paid-tier upgrade. A paid Google project may incur charges: free usage depends on the project's billing tier, not the API key name.

Five attempts per IP per hour is a best-effort instance-local throttle, not a deployment-wide limit. Configure a Vercel Firewall limit before broad sharing. UI recording limit: 30 seconds. Server limit: 3 MB. Timeout: 50 seconds.

Build and mocked route tests check protocol, transcript passthrough, invalid responses, silence, provider limits and missing configuration. Actual Gemini accuracy remains unverified until a key is configured. Test Japanese and English, names, dates, recommendations versus completed travel, and silence.

References:
- https://ai.google.dev/gemini-api/docs/audio
- https://ai.google.dev/gemini-api/docs/pricing
- https://ai.google.dev/api/generate-content
