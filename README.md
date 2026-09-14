# UNUKAR

An editorial, mobile-first landing page built with Next.js App Router, TypeScript and Tailwind CSS 4. No authentication, database, payments or app functionality.

## Run locally

Use Node.js 22 or newer and pnpm 11.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

## Verify

```sh
pnpm typecheck
pnpm build
pnpm start
```

## Deploy to Vercel

Import this directory as a Next.js project. Vercel detects the framework and build command automatically. Set `NEXT_PUBLIC_SITE_URL` to your deployed HTTPS origin, then deploy. Set environment variables before building.

## Email signup

The form deliberately does not claim a successful signup until an actual endpoint returns a successful response. Without configuration, it explains that the email has not been saved.

Set `NEXT_PUBLIC_SIGNUP_ENDPOINT` to your email provider or HTTPS form service endpoint. It must accept a JSON POST `{ "email": "traveler@example.com" }`, return a 2xx response only after acceptance, and allow requests from your deployed origin via CORS. Use a public submission endpoint; never place service secrets in `NEXT_PUBLIC_*` variables. Configure provider-side rate limiting, consent handling and your appropriate privacy notice before opening signups. The UI includes native email validation, a pending state, timeout and recoverable error feedback.

## Structure

- `app/page.tsx`: page entry
- `app/layout.tsx`: SEO and social metadata
- `app/globals.css`: shared visual tokens and responsive styles
- `components/landing.tsx`: complete landing page sections
- `components/signup-form.tsx`: isolated client-side form
- `public/images/`: locally stored photographs, no runtime image host dependency

Journey stories and book contents are explicitly labeled illustrative concept previews. Product copy describes the proposed product, with early-access status stated near signup.

## Photography

Used under the free Unsplash License (https://unsplash.com/license).

- Kevin Charit, Luang Prabang river landscape: https://unsplash.com/photos/village-nestled-by-a-wide-river-with-mountains-beyond-QQ_CJiTod30
- Vitaly Gariev, friends by a lake: https://unsplash.com/photos/friends-gathered-around-campfire-by-a-lake-0aI54kAjWP8
