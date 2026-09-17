// Node: "Fetch ATS Jobs (Greenhouse/Lever/Ashby)"
// Mode: Run Once for All Items
//
// Calls each target company's public ATS board API directly (no browser automation,
// no scraping — these are the same JSON endpoints the employer's own careers page uses).
// Edit TARGET_COMPANIES below, or swap the array for an Airtable lookup later.

const TARGET_COMPANIES = [
  // { company: 'stripe', ats: 'greenhouse' },
  // { company: 'airbnb', ats: 'greenhouse' },
  // { company: 'netflix', ats: 'lever' },
  // { company: 'ashbyhq', ats: 'ashby' },
];

const results = [];

for (const target of TARGET_COMPANIES) {
  const { company, ats } = target;
  let url;

  if (ats === 'greenhouse') {
    url = `https://boards-api.greenhouse.io/v1/boards/${company}/jobs?content=true`;
  } else if (ats === 'lever') {
    url = `https://api.lever.co/v0/postings/${company}?mode=json`;
  } else if (ats === 'ashby') {
    url = `https://api.ashbyhq.com/posting-api/job-board/${company}`;
  } else {
    continue;
  }

  let response;
  try {
    response = await this.helpers.httpRequest({
      method: 'GET',
      url,
      json: true,
      // Companies without an active board on a given ATS return 404 — that's expected, skip it.
      ignoreHttpStatusErrors: true,
    });
  } catch (err) {
    continue;
  }

  if (!response) continue;

  if (ats === 'greenhouse') {
    const jobs = response.jobs || [];
    for (const job of jobs) {
      results.push({
        json: {
          source: 'greenhouse',
          company,
          raw: job,
        },
      });
    }
  } else if (ats === 'lever') {
    const jobs = Array.isArray(response) ? response : [];
    for (const job of jobs) {
      results.push({
        json: {
          source: 'lever',
          company,
          raw: job,
        },
      });
    }
  } else if (ats === 'ashby') {
    const jobs = response.jobs || [];
    for (const job of jobs) {
      results.push({
        json: {
          source: 'ashby',
          company,
          raw: job,
        },
      });
    }
  }
}

return results;
