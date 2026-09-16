// Node: "Role Queries"
// Mode: Run Once for All Items
// Sits between Schedule Trigger and Adzuna/JSearch. Fans out one item per
// role-family query, so each source node runs once per role instead of one
// query string trying (and failing) to cover ops + PM + automation at once.
// Edit TARGET_JOB_QUERIES (comma-separated) in .env to add/remove roles.

const queries = ($env.TARGET_JOB_QUERIES || 'operations manager')
  .split(',')
  .map((q) => q.trim())
  .filter(Boolean);

return queries.map((query) => ({ json: { query } }));
