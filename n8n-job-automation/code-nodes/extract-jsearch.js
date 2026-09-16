// Node: "Extract: JSearch"
// Mode: Run Once for All Items
// JSearch Search now runs once per role query (see "Role Queries"), so this
// gets one input item per query, each holding a `data` array. Flatten all
// of them into one n8n item per job, tagged with its source.

const output = [];

for (const item of $input.all()) {
  const jobs = item.json.data || [];
  for (const job of jobs) {
    output.push({ json: { source: 'jsearch', raw: job } });
  }
}

return output;
