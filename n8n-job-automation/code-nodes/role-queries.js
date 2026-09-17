// Node: "Role Queries"
// Mode: Run Once for All Items
// Sits between Config and Adzuna/JSearch. Fans out one item per
// role-family query, so each source node runs once per role instead of one
// query string trying (and failing) to cover ops + PM + automation at once.
// Edit the "target_job_queries" field (comma-separated) in the Config node
// to add/remove roles.

const queries = ($('Config').first().json.target_job_queries || 'operations manager')
  .split(',')
  .map((q) => q.trim())
  .filter(Boolean);

return queries.map((query) => ({ json: { query } }));
