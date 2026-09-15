# Candidate Profile Template

This is the source text the Anthropic nodes use for both fit-scoring and cover-letter
generation. It goes into the `CANDIDATE_PROFILE` environment variable (see
`.env.example`) as one plain-text blob.

**This is per candidate/client.** This workflow, as built, runs one profile at a
time. Running it for multiple clients means either (a) duplicating this workflow
per client with its own `CANDIDATE_PROFILE` and Airtable base, or (b) extending
Step 11 (dedupe/fetch stage) to pull the active profile from an Airtable
"Candidates" table keyed by client ID — flagging that as a v2 change, not built here.

Fill in every section with real numbers. The cover-letter prompt is instructed to
never invent experience — if a section is thin or empty, the model will skip
addressing whatever that section would have covered rather than fabricate it. Thin
input produces thin (but honest) letters.

---

## Candidate Profile: [Name]

### Target roles
[e.g., "Operations Manager, Business Operations Lead, Chief of Staff — remote or
hybrid, $X–$Y range"]

### Summary (2-3 sentences)
[Who they are professionally, in plain language — not a personality description,
a positioning statement.]

### Work history (most recent first)

**[Job Title] — [Company] ([Start] – [End])**
- [Achievement with a number: "Cut vendor spend 18% by renegotiating 6 contracts"]
- [Achievement with a number: "Managed a team of 4, reduced onboarding time from 3 weeks to 5 days"]
- [Achievement with a number]

**[Job Title] — [Company] ([Start] – [End])**
- [Achievement with a number]
- [Achievement with a number]

[Repeat for each relevant role — 2-4 roles is usually enough context.]

### Skills / tools
[e.g., "Airtable, Notion, HubSpot, QuickBooks, Zapier/n8n, Slack admin,
project management (Asana/ClickUp)"]

### Certifications / education
[Degree, certs — only if relevant to target roles. Omit if not.]

### What they will NOT claim
[Optional but useful: known gaps to be honest about, e.g. "no direct P&L
ownership yet" — helps you sanity-check letters aren't stretching.]

---

## Assumption flagged
I added the "What they will NOT claim" section — it's not in your original spec,
but it gives you (or the VA reviewing letters) a fast way to sanity-check that the
"don't invent, don't stretch" instruction actually held. Delete it if you don't
want it.
