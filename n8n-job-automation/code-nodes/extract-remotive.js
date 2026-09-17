// Node: "Extract: Remotive"
// Mode: Run Once for All Items
// Remotive Search runs once per role query (see "Role Queries"), so flatten
// every input item's jobs array, not just the first.

const output = [];

for (const item of $input.all()) {
  const jobs = item.json.jobs || [];
  for (const job of jobs) {
    output.push({ json: { source: 'remotive', raw: job } });
  }
}

return output;
