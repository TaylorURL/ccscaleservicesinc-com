import { useCallback, useEffect, useState } from 'react';
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

/**
 * Holds the request a page has just handed to the mail program, and the state
 * of the button that copies it.
 *
 * Both request pages do the same thing once the form validates: hand the
 * message to the mail program, keep it on screen for a visitor whose machine
 * opened nothing, and offer it as a copy. The pages differ only in what they
 * compose, so the composed message is the argument and the rest lives here.
 */
export function useSentRequest() {
  const [sent, setSent] = useState(null);
  const [copied, setCopied] = useState(false);

  // The label reverts on its own, so the button offers the copy again; a
  // permanent "Copied" reads as a dead control. The timer lives in an effect
  // rather than in the handler so leaving the page clears it.
  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const send = useCallback((request) => {
    setSent(request);
    setCopied(false);
    window.location.href = request.mailto;
  }, []);

  const copyRequest = useCallback(async () => {
    if (!sent) return;
    try {
      await navigator.clipboard.writeText(`${sent.subject}\n\n${sent.body}`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }, [sent]);

  return { sent, copied, send, copyRequest };
}
