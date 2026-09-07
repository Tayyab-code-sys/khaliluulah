# Khalilullah - Project Context

## What this is
A survey website plus a private dashboard. It tests one business idea for the client, Khalilullah:
a directory of trusted suppliers from Afghanistan. Buyers use it for free. Sellers pay to be listed.
Friends of the client fill a short survey so he can see if the idea is worth building.

Built by TFH Software (https://tfhsoftware.com).

## Parts
1. `index.html` - the survey landing page. 14 questions, all multiple choice, plus name and optional contact.
2. `dashboard.html` - the owner dashboard ("The Feedback Ledger"). Password gate, stats, bar charts, and a table of every answer.
3. `api/` - serverless functions that talk to Airtable. The secret token lives here as an env var, never in the browser or the repo.

## Airtable (the database)
- Base: `appw2YRB8ziLp5Hhs` (the client's existing "Main" base)
- Table: `Khalilullah Survey` (id `tblrkuYyD7IVrJ5Yh`)
- The table is empty and ready for real answers (the demo/test rows were deleted).
- Field names in the table match the question keys used in `assets/survey.js` and `assets/dashboard.js`. If you rename a field in Airtable, rename it in those files too.

## How the data flows
- Survey submit -> `POST /api/submit` -> Airtable create record (server adds the `Submitted` time).
- Dashboard -> `GET /api/responses` with header `x-dash-password` -> server checks the password, then returns all records.
- The dashboard password is checked on the SERVER (env var `DASH_PASSWORD`), so the data cannot be read without it.

## Environment variables (set in `.env` locally and in Vercel)
- `AIRTABLE_TOKEN` - the secret Airtable token (starts with `pat`). NOT committed.
- `AIRTABLE_BASE` = `appw2YRB8ziLp5Hhs`
- `AIRTABLE_TABLE` = `Khalilullah Survey`
- `DASH_PASSWORD` - dashboard login password (default `khalil2026`).
The code has these base/table values as fallback defaults, so only the token and password truly must be set.

## Run it locally
```
node dev-server.js
```
- Survey: http://localhost:3000
- Dashboard: http://localhost:3000/dashboard.html
`dev-server.js` serves the files AND runs the same `/api` code Vercel runs, reading values from `.env`.

## Deploy (Vercel)
Import the GitHub repo, add the four env vars above, deploy. No build step. `/api/*.js` become serverless functions automatically; everything else is static.

## Repo and accounts
- GitHub: https://github.com/Tayyab-code-sys/khaliluulah (push only from the `Tayyab-code-sys` account).
- Commits use a repo-local git identity `Tayyab-code-sys` (the global git identity on this machine is a different account, so always set it per-repo here).

## Writing style (client rule)
All copy must be very simple, second-grade English. Short sentences. No em dashes. Survey questions stay multiple choice.

## Contact
Khalilullah WhatsApp: +90 541 107 3398 (set in `config.js` as `whatsapp`).

## Security note
The Airtable token was once shared in plain chat. Roll it (make a new token, update `.env` and Vercel, delete the old) when convenient.
