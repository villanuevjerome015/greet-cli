// Node: "Compute Dedupe Hash"
// Mode: Run Once for All Items
// Adds a stable `dedupe_hash` field = sha256(company + title + location),
// normalized to lowercase/trimmed so minor formatting differences between
// sources don't create duplicate hashes for the same posting.

const crypto = require('crypto');

return $input.all().map((item) => {
  const { company, title, location } = item.json;

  const key = [company, title, location]
    .map((v) => String(v || '').trim().toLowerCase())
    .join('|');

  const dedupe_hash = crypto.createHash('sha256').update(key).digest('hex');

  return {
    json: {
      ...item.json,
      dedupe_hash,
    },
  };
});
