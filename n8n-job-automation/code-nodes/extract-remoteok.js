// Node: "Extract: RemoteOK"
// Mode: Run Once for All Items
//
// RemoteOK's API takes no search parameter — it returns its whole recent feed
// — so filter here against the same role queries the other sources use.
// Without this, every listing would go on to cost an Anthropic call.

const queries = ($('Config').first().json.target_job_queries || '')
  .split(',')
  .map((q) => q.trim().toLowerCase())
  .filter(Boolean);

// n8n may split a top-level JSON array response into one item per element,
// or hand back a single item holding the array. Handle both.
const rows = [];
for (const item of $input.all()) {
  const j = item.json;
  if (Array.isArray(j)) rows.push(...j);
  else if (Array.isArray(j.data)) rows.push(...j.data);
  else rows.push(j);
}

const output = [];

for (const row of rows) {
  // The feed's first element is RemoteOK's legal notice, not a job.
  if (!row || row.legal || !(row.position || row.title)) continue;

  const haystack = [row.position, row.title, row.company, (row.tags || []).join(' ')]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const matches =
    queries.length === 0 ||
    queries.some((q) => q.split(/\s+/).every((word) => haystack.includes(word)));

  if (!matches) continue;

  output.push({ json: { source: 'remoteok', raw: row } });
}

return output;
