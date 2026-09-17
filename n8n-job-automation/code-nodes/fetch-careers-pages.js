// Node: "Fetch Careers Pages"
// Mode: Run Once for All Items
//
// Fetches employer careers pages for companies that don't use a supported ATS,
// strips the HTML down to plain text, and hands it to the model to extract
// postings (see the "Anthropic - Extract Jobs from Page" node).
//
// Add ONLY pages you have checked are OK to read automatically: visit
// thesite.com/robots.txt and skim their terms for "automated", "scraping",
// "crawl".
//
// Do NOT put large commercial job boards here (JobStreet, Indeed, LinkedIn,
// etc.) — their terms ban automated collection and they run bot detection, so
// it is the same ToS/ban risk this project ruled out on day one.

const CAREERS_PAGES = [
  // { company: 'Example VA Agency', url: 'https://example.com/careers' },
];

const results = [];

for (const page of CAREERS_PAGES) {
  let html;
  try {
    html = await this.helpers.httpRequest({
      method: 'GET',
      url: page.url,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; JobWatcher/1.0)' },
      ignoreHttpStatusErrors: true,
    });
  } catch (err) {
    continue;
  }

  if (typeof html !== 'string' || !html.trim()) continue;

  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 6000);

  // Too little text usually means the listings are rendered by JavaScript,
  // which a plain fetch can't see. Skip rather than send junk to the model.
  if (text.length < 100) continue;

  results.push({ json: { company: page.company, url: page.url, page_text: text } });
}

return results;
