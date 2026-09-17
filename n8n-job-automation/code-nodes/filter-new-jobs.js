// Node: "Filter New Jobs"
// Mode: Run Once for All Items
// Drops any job whose dedupe_hash already exists in the Applications table
// (pulled in by the upstream "Airtable: Get Existing Hashes" node) — AND
// drops duplicates within this run itself, since running multiple role
// queries (ops/PM/automation) can surface the same posting more than once.

const existingHashes = new Set(
  $('Airtable: Get Existing Hashes')
    .all()
    .map((item) => item.json['Job ID'])
    .filter(Boolean)
);

const seenThisRun = new Set();
const output = [];

for (const item of $input.all()) {
  const hash = item.json.dedupe_hash;
  if (existingHashes.has(hash) || seenThisRun.has(hash)) continue;
  seenThisRun.add(hash);
  output.push(item);
}

return output;
