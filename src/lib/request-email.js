import { company } from '../content/company';

/**
 * Quote and service requests leave as email rather than through a backend, so
 * the site has no server, no database, and nothing holding customer details.
 * The composed message is the deliverable: sales has to be able to act on it
 * without opening the site or asking a follow-up question, which is why the
 * per-line details ride along with each part.
 *
 * The plain text is built separately from the mailto link so the request page
 * can show it on screen. A mailto opens nothing on a machine with no mail client
 * configured, and a visitor who can see and copy the message is not stuck.
 */

function formatQuoteLines(items) {
  return items
    .map((item, index) => {
      const detail = item.details.trim();
      // The list allows a transiently empty quantity while its field is being
      // edited; the email always carries a real number.
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const lines = [`${index + 1}. ${item.name} (qty ${quantity})`];
      if (detail) lines.push(`   ${detail.replace(/\n/g, '\n   ')}`);
      return lines.join('\n');
    })
    .join('\n');
}

function formatContact(contact) {
  return [
    `Name:    ${contact.name}`,
    `Company: ${contact.company}`,
    `Email:   ${contact.email}`,
    `Phone:   ${contact.phone}`,
  ].join('\n');
}

/** @returns {{ subject: string, body: string, mailto: string }} */
export function buildQuoteRequest({ contact, items, notes }) {
  const subject = `Parts quote request: ${contact.company || contact.name}`;
  const body = [
    formatContact(contact),
    '',
    'Parts requested:',
    formatQuoteLines(items),
    '',
    notes.trim() ? `Notes:\n${notes.trim()}` : '',
  ]
    .join('\n')
    .trim();

  return { subject, body, mailto: toMailto(company.email.sales, subject, body) };
}

/** @returns {{ subject: string, body: string, mailto: string }} */
export function buildServiceRequest({ contact, service, message }) {
  const subject = service ? `Service request: ${service}` : 'Service request';
  const body = [formatContact(contact), service ? `Service: ${service}` : '', '', message.trim()]
    .filter(Boolean)
    .join('\n')
    .trim();

  return { subject, body, mailto: toMailto(company.email.sales, subject, body) };
}

function toMailto(recipient, subject, body) {
  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
