# SalesOS — Gemini API on Vercel

SalesOS keeps the Gemini credential on the server. Do not put it in a `NEXT_PUBLIC_*` variable.

## Vercel

Open the **SalesOS** project in Vercel.

Go to **Settings → Environment Variables** and add:

| Name | Value |
|---|---|
| `GEMINI_API_KEY` | Your Gemini API key |
| `GEMINI_MODEL` | `gemini-3.8-flash` |
| `GEMINI_BASE_URL` | `https://generativelanguage.googleapis.com/v1beta` |

Select **Production**, **Preview**, and **Development** for the variables.

Then redeploy from the current `main` branch.

## Google AI Studio

Create or copy the key from Google AI Studio. Google recommends environment variables for Gemini keys. Keys created in AI Studio from May 28, 2026 are authorization keys; unrestricted standard keys are rejected by the Gemini API, so use a key that is restricted appropriately to Gemini. citeturn331294search0turn331294search2

## SOLID

The top-bar assistant is called **SOLID**.

With `GEMINI_API_KEY` set, SOLID calls Gemini's `models.generateContent` endpoint using the configured model. Gemini's current REST endpoint is `https://generativelanguage.googleapis.com/v1beta/{model}:generateContent`. citeturn331294search1

Without the key, SalesOS falls back to its local assistant so the application remains usable.

## Important

Never commit the Gemini key to GitHub.

Never create `NEXT_PUBLIC_GEMINI_API_KEY`.

Never store the Gemini key in a Supabase public table.

The current app also supports Gemini file analysis in SOLID for supported uploads.