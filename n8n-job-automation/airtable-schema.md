# Airtable Schema

Two tables in one base. Use Airtable (not Sheets) if you want the linked-record
and single-select niceties below — everything here also works in Google Sheets
with single-select columns replaced by plain text and the "Get Existing Hashes"
node swapped for a Google Sheets "Lookup" op.

## Table: `Applications`

| Field           | Type                                      | Notes                                                    |
|-----------------|--------------------------------------------|-----------------------------------------------------------|
| Job ID          | Single line text (primary field)          | The `dedupe_hash` (sha256 of company+title+location). Unique per posting. |
| Title           | Single line text                          |                                                             |
| Company         | Single line text                          |                                                             |
| Location        | Single line text                          |                                                             |
| URL             | URL                                       | Link to the original posting                               |
| Description     | Long text                                 | Raw JD, truncated to ~4000 chars upstream                  |
| Source          | Single select: `adzuna`, `jsearch`, `greenhouse`, `lever`, `ashby` | |
| Posted At       | Date                                      | From the source, when available                            |
| Fit Score       | Number (integer, 0–100)                   |                                                             |
| Fit Reason      | Long text                                 | One-line model rationale                                    |
| Cover Letter    | Long text                                 | Empty for skipped rows                                      |
| Status          | Single select: `pending`, `submitted`, `skipped` | Written as `pending`/`skipped` by the workflow. A VA flips it to `submitted` after clicking Submit — this is the human-in-the-loop checkpoint. |
| Candidate       | Single line text                          | Which client/candidate this run is for — matters once you're running this for more than one client. See note below. |
| Discovered At   | Created time                              | Airtable auto-field                                         |
| Submitted At    | Date                                      | Set manually by the VA when they flip Status to `submitted` |

**Job ID is the field the "Get Existing Hashes" and "Filter New Jobs" nodes key
off of** — don't rename it without updating those two nodes.

## Table: `Target Companies` (optional, feeds the ATS fetch step)

| Field    | Type                                              | Notes |
|----------|-----------------------------------------------------|-------|
| Company  | Single line text                                    | The ATS board slug, e.g. `stripe`, not the display name |
| ATS      | Single select: `greenhouse`, `lever`, `ashby`       |       |
| Active   | Checkbox                                            | Uncheck to pause a company without deleting the row |

This table isn't wired into the workflow by default — `Fetch ATS Jobs` currently
reads a hardcoded array in-code (see `code-nodes/fetch-ats-jobs.js`). If your
target-company list grows past ~15-20 or changes often, wire this table in with
an Airtable "List" node feeding the Code node instead of hand-editing the array.
Flagging that as a straightforward follow-up, not built into v1.

## Assumption flagged
Your spec didn't mention multi-client support, but NXTGen runs VAs across
multiple client accounts — so I added the `Candidate` field. If this workflow
is only ever going to run for one candidate at a time, ignore it or delete it;
it doesn't affect dedupe or scoring either way.
