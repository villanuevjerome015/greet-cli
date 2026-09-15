// Node: "Mark Skipped"
// Mode: Run Once for Each Item
// Runs on jobs that failed the fit-score gate (< 70). No cover letter is
// generated — we don't spend an Anthropic call on a job we're not pursuing.

const job = $('Parse Fit Score').item.json;

return {
  json: {
    ...job,
    cover_letter: '',
    status: 'skipped',
  },
};
