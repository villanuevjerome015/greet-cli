// Node: "Parse Extracted Jobs"
// Mode: Run Once for All Items
// Turns the model's JSON-array response for each careers page into one item
// per job, in the same {source, company, raw} shape the other sources emit.

const responses = $input.all();
const pages = $('Fetch Careers Pages').all();
const output = [];

for (let i = 0; i < responses.length; i++) {
  const text = responses[i].json.content?.[0]?.text || '';
  const page = pages[i]?.json || {};

  let jobs;
  try {
    jobs = JSON.parse(text);
  } catch (err) {
    const match = text.match(/\[[\s\S]*\]/);
    try {
      jobs = match ? JSON.parse(match[0]) : [];
    } catch (err2) {
      jobs = [];
    }
  }

  if (!Array.isArray(jobs)) continue;

  for (const job of jobs) {
    if (!job || !job.title) continue;
    output.push({
      json: {
        source: 'careers_page',
        company: page.company || '',
        raw: {
          title: job.title,
          location: job.location || '',
          description: job.description || '',
          url: job.url || page.url || '',
        },
      },
    });
  }
}

return output;
