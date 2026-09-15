// Node: "Build Digest Message"
// Mode: Run Once for All Items
// Consumes the single aggregated item from "Aggregate for Digest" and builds
// one batched Slack message instead of pinging per job.

const jobs = $input.first().json.data || [];

if (jobs.length === 0) {
  return [{ json: { digest_text: '' } }];
}

const lines = jobs.map((job, i) => {
  return [
    `*${i + 1}. ${job.title}* — ${job.company}`,
    `   Fit: ${job.fit_score}/100 — ${job.fit_reason}`,
    `   ${job.location || 'Location not listed'} | ${job.source}`,
    `   <${job.url}|Open posting>`,
  ].join('\n');
});

const digest_text = [
  `*${jobs.length} new application${jobs.length === 1 ? '' : 's'} ready for review* :inbox_tray:`,
  '',
  ...lines,
  '',
  'Cover letters are drafted and rows are logged as `pending` in Airtable. Review, then submit.',
].join('\n');

return [{ json: { digest_text, job_count: jobs.length } }];
