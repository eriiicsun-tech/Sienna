# Sienna Space — Cloudflare Pages v3

This version includes:
- more playful design for a 12-year-old girl
- fixed calendar date handling
- shared sync across devices using Cloudflare KV
- delete buttons for tasks, notes, and dates
- password login page
- removed user-facing setup instructions from the page
- Sofia spelling corrected

## Cloudflare setup required

### 1) Environment variables
Add in Cloudflare Pages:
- OPENAI_API_KEY = your real OpenAI API key
Optional:
- OPENAI_MODEL = gpt-4.1-mini

### 2) KV binding (required for cross-device sync)
Create a Cloudflare KV namespace, then bind it to this Pages project as:
- Variable name: PLANNER_KV

Without PLANNER_KV, the site will still work on one device using local storage, but cross-device sync will not work.

### 3) Password
The password is already built in:
- iamamazing
