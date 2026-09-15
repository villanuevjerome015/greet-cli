// Node: "Filter New Jobs"
// Mode: Run Once for All Items
// Drops any job whose dedupe_hash already exists in the Applications table
// (pulled in by the upstream "Airtable: Get Existing Hashes" node).

const existingHashes = new Set(
  $('Airtable: Get Existing Hashes')
    .all()
    .map((item) => item.json['Job ID'])
    .filter(Boolean)
);

return $input
  .all()
  .filter((item) => !existingHashes.has(item.json.dedupe_hash));
