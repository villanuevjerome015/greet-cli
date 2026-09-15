# Job Application Automation — n8n Workflow

Job-seeker side: applies to roles on behalf of a candidate/client. Everything up
to "Submit" is automated; a human (VA) submits. Full-auto only where the employer's
own ATS accepts API submissions — this build doesn't attempt that yet (see
"What's not built" below).

## What this does

Every 6 hours:
1. Pulls job listings from **Adzuna**, **JSearch (RapidAPI)**, and public
   **Greenhouse/Lever/Ashby** board endpoints for a hardcoded list of target
   companies — no browser automation, no LinkedIn/Indeed scraping.
2. Normalizes all three shapes into one schema.
3. Hashes `company + title + location` and drops anything already logged in
   Airtable, so re-runs don't re-process the same posting.
4. Sends each new job + the candidate profile to Claude for a 0–100 fit score.
   Anything under 70 gets logged as `skipped` and stops there — no letter, no
   wasted Anthropic call.
5. For jobs scoring ≥ 70, generates a cover letter (200 words max, instructed
   to never invent experience not in the candidate profile).
6. Writes every processed job to Airtable with `status = pending` (passers) or
   `status = skipped` (non-passers).
7. Sends **one batched Slack digest** per run listing everything that's ready
   for review — not a ping per job.
8. A VA opens the digest, reviews the drafted letter, and clicks Submit
   (~60 seconds). They then flip that row's `Status` to `submitted` in Airtable.
   That's your human checkpoint and your audit trail.

## Files in this folder

| File | Purpose |
|---|---|
| `workflow.json` | Import directly into n8n (Workflows → Import from File). |
| `candidate-profile-template.md` | Fill this out per candidate; feeds both Anthropic calls. |
| `code-nodes/*.js` | Same code as the workflow's Code nodes, kept as standalone files so you can review/diff them outside the n8n UI. |
| `airtable-schema.md` | Table/field definitions. Build this in Airtable before importing the workflow. |
| `.env.example` | Every variable the workflow reads via `{{$env.VAR_NAME}}`. |

## Setup steps

1. **Build the Airtable base.** Follow `airtable-schema.md` — at minimum, the
   `Applications` table with a `Job ID` primary field. Do this first; the
   workflow's dedupe step depends on it existing (an empty table is fine).

2. **Get API keys.**
   - Adzuna: https://developer.adzuna.com/ (free, 1k calls/mo)
   - JSearch: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
   - Anthropic: https://console.anthropic.com/

3. **Fill out `candidate-profile-template.md`** with real numbers, then copy
   the result into `CANDIDATE_PROFILE` in your `.env` (or n8n Cloud Variables).

4. **Copy `.env.example` to `.env`** and fill in the rest. Where these actually
   live depends on your n8n setup:
   - Self-hosted (Docker/npm): real process environment variables.
   - n8n Cloud: use the built-in **Variables** feature instead — Cloud
     restricts arbitrary `$env` access. Same variable names, different storage.
   *(Assumption: I built this assuming one of those two setups. If you're on
   something else, the `{{$env.X}}` expressions are the only thing that'd
   need to change.)*

5. **Set up n8n credentials** for Airtable and Slack (Settings → Credentials).
   The workflow JSON references credentials named "Airtable account" and
   "Slack account" — after import, open the two Airtable nodes and the Slack
   node and point each at your real credential (n8n will flag them as
   unlinked on import; this is normal for a shared template).

6. **Edit the target-company list.** Open the `Fetch ATS Jobs` Code node and
   fill in `TARGET_COMPANIES` with the Greenhouse/Lever/Ashby board slugs you
   want to watch (the slug is the URL segment in the company's public job
   board, e.g. `boards.greenhouse.io/stripe` → `stripe`). Leave it empty to
   run on Adzuna + JSearch only.

7. **Import `workflow.json`** into n8n, fix the credential links from step 5,
   activate the workflow.

8. **Test with the schedule trigger disabled first.** Click "Execute Workflow"
   manually, watch it run node-by-node, confirm a row lands in Airtable and a
   message lands in Slack before you turn on the 6-hour schedule.

## What's not built (scope calls, not oversights)

- **Multi-candidate support.** This workflow runs one `CANDIDATE_PROFILE` at a
  time. Running it for multiple clients means duplicating the workflow per
  client (separate env vars + Airtable base) or extending it to pull the
  active profile from a `Candidates` table — noted in `airtable-schema.md`,
  not built here since you didn't specify multi-client in the brief.
- **Direct ATS API submission** (the Greenhouse/Lever/Ashby "full auto"
  exception from your brief). This build only *reads* those boards for
  listings; wiring up actual submission would be employer-specific (which
  fields their application form needs) and I didn't want to guess at that
  without a real target employer to test against. The human-submit path
  covers 100% of sources today; automating submission for a specific
  ATS-enabled employer is a follow-up once you pick one.
- **Automated `submitted`/`skipped` reply-rate reporting.** The schema
  supports it (Status + Submitted At fields), but no dashboard/report node is
  built — wasn't in the "architecture to build" list, just the schema.
- **Target-company list isn't Airtable-driven yet** — it's a hardcoded array
  in the `Fetch ATS Jobs` Code node. Fine under ~20 companies; wire in the
  optional `Target Companies` table (schema included) once it grows.

## A note on the cover-letter instruction

Your "don't invent, don't stretch" system prompt is preserved verbatim in the
`Anthropic - Cover Letter` node. I didn't touch it — it's doing exactly what
you said it needs to do.
