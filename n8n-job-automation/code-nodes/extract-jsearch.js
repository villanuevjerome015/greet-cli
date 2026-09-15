// Node: "Extract: JSearch"
// Mode: Run Once for All Items
// Splits the single JSearch (RapidAPI) response (one item holding a `data` array)
// into one n8n item per job, tagged with its source.

const body = $input.first().json;
const jobs = body.data || [];

return jobs.map((job) => ({
  json: {
    source: 'jsearch',
    raw: job,
  },
}));
