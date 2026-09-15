// Node: "Attach Cover Letter"
// Mode: Run Once for Each Item
// Runs only on jobs that passed the fit-score gate. Attaches the generated
// letter and marks the record ready for a VA to review and submit.

const response = $input.item.json;
const letter = response.content?.[0]?.text?.trim() || '';
const job = $('Parse Fit Score').item.json;

return {
  json: {
    ...job,
    cover_letter: letter,
    status: 'pending',
  },
};
