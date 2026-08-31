/**
 * Questions customers ask before they call, answered on the page instead of on
 * the phone. These are also published as FAQ structured data, so each answer is
 * written to stand on its own: a search result may show it without the
 * surrounding page.
 *
 * Keep answers to what is true of the work itself. Anything that varies by
 * customer or by visit, such as response time, price, or coverage, belongs in a
 * conversation.
 */

export const faqs = [
  {
    question: 'How often does a scale need to be calibrated?',
    answer:
      'It depends on how hard the scale works and how much rides on the reading. Scales used in trade, billing, or batching are commonly done quarterly or annually. A scale in a rough environment or under constant use gets checked more often. Picking a fixed interval matters more than picking the perfect number, because a scale on a schedule gets checked whether or not anyone has noticed a problem.',
  },
  {
    question: 'What does a calibration certificate show?',
    answer:
      "The readings taken at each test point before any adjustment, the readings after, the weights used as the reference, and the date and technician. The as-found numbers are the important part. They tell you whether the scale was accurate over the period you've already been running on it.",
  },
  {
    question: "My scale reads differently depending on where the load sits. What's wrong?",
    answer:
      'That pattern usually points to a corner out of trim, a failing load cell, or a platform touching its frame. A technician loads each corner in turn and compares the readings, then trims at the junction box or replaces the cell.',
  },
  {
    question: "Do you service scales you didn't install?",
    answer:
      'Yes. Calibration, repair, and maintenance cover the equipment already in the field regardless of who sold it, and parts are supplied the same way.',
  },
  {
    question: 'How do I find the part I need if the number has worn off?',
    answer:
      "Send the scale make and model along with a photo of the part and its mounting. That's usually enough to identify it. If the tag is gone entirely, the capacity of the scale and the number of cells under it narrow the options quickly.",
  },
  {
    question: 'Why are parts quoted instead of priced on the site?',
    answer:
      'Two cells that look identical can differ in capacity, output, cable length, and mounting, and every one of those moves the price. Give us the model and the symptom, and the quote is for the exact part your scale takes.',
  },
];
