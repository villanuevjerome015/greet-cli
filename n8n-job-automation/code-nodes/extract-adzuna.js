// Node: "Extract: Adzuna"
// Mode: Run Once for All Items
// Splits the single Adzuna API response (one item holding a `results` array)
// into one n8n item per job, tagged with its source.

const body = $input.first().json;
const jobs = body.results || [];

return jobs.map((job) => ({
  json: {
    source: 'adzuna',
    raw: job,
  },
}));
