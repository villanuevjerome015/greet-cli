// Node: "Normalize Jobs"
// Mode: Run Once for All Items
// Maps every source's raw shape into one flat schema:
// { title, company, location, url, description, posted_at, source }

function normalizeAdzuna(raw) {
  return {
    title: raw.title || '',
    company: raw.company?.display_name || '',
    location: raw.location?.display_name || '',
    url: raw.redirect_url || '',
    description: raw.description || '',
    posted_at: raw.created || '',
  };
}

function normalizeJSearch(raw) {
  const location = [raw.job_city, raw.job_state, raw.job_country]
    .filter(Boolean)
    .join(', ');
  return {
    title: raw.job_title || '',
    company: raw.employer_name || '',
    location: location || (raw.job_is_remote ? 'Remote' : ''),
    url: raw.job_apply_link || raw.job_google_link || '',
    description: raw.job_description || '',
    posted_at: raw.job_posted_at_datetime_utc || '',
  };
}

function normalizeGreenhouse(raw, company) {
  return {
    title: raw.title || '',
    company,
    location: raw.location?.name || '',
    url: raw.absolute_url || '',
    description: raw.content || '',
    posted_at: raw.updated_at || '',
  };
}

function normalizeLever(raw, company) {
  return {
    title: raw.text || '',
    company,
    location: raw.categories?.location || '',
    url: raw.hostedUrl || '',
    description: raw.descriptionPlain || raw.description || '',
    posted_at: raw.createdAt
      ? new Date(Number(raw.createdAt)).toISOString()
      : '',
  };
}

function normalizeAshby(raw, company) {
  return {
    title: raw.title || '',
    company,
    location: raw.location || '',
    url: raw.jobUrl || raw.applyUrl || '',
    description: raw.descriptionPlain || raw.description || '',
    posted_at: raw.publishedAt || '',
  };
}

const output = [];

for (const item of $input.all()) {
  const { source, company, raw } = item.json;
  let normalized;

  switch (source) {
    case 'adzuna':
      normalized = normalizeAdzuna(raw);
      break;
    case 'jsearch':
      normalized = normalizeJSearch(raw);
      break;
    case 'greenhouse':
      normalized = normalizeGreenhouse(raw, company);
      break;
    case 'lever':
      normalized = normalizeLever(raw, company);
      break;
    case 'ashby':
      normalized = normalizeAshby(raw, company);
      break;
    default:
      continue;
  }

  // Drop anything missing the fields we can't safely fall back on.
  if (!normalized.title || !normalized.company || !normalized.url) continue;

  output.push({
    json: {
      ...normalized,
      source,
    },
  });
}

return output;
