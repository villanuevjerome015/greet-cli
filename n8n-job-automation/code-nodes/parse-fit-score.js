// Node: "Parse Fit Score"
// Mode: Run Once for Each Item
// Parses the Anthropic fit-score response and merges the score/reason
// back onto the original job record.

const response = $input.item.json;
const text = response.content?.[0]?.text || '';

let parsed;
try {
  parsed = JSON.parse(text);
} catch (err) {
  const match = text.match(/\{[\s\S]*\}/);
  parsed = match ? JSON.parse(match[0]) : { score: 0, reason: 'Could not parse model output' };
}

const job = $('Filter New Jobs').item.json;

return {
  json: {
    ...job,
    fit_score: Number(parsed.score) || 0,
    fit_reason: String(parsed.reason || '').slice(0, 500),
  },
};
