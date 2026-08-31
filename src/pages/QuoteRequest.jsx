import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Copy, Mail, PackageSearch, Trash2, Undo2 } from 'lucide-react';
import ContactFields from '../components/ContactFields';
import FormErrorSummary from '../components/FormErrorSummary';
import FormField from '../components/FormField';
import PageHeader from '../components/PageHeader';
import { company } from '../content/company';
import { focusField, useContactForm } from '../lib/contact-form';
import { useQuote } from '../lib/quote-context';
import { buildQuoteRequest } from '../lib/request-email';
import { useSeo } from '../lib/seo';
import { iconSize } from '../lib/icon-size';

export const metadata = {
  title: 'Request a Parts Quote for Your Scale',
  description:
    'Send your parts list to Compound Industrial Scale Services with the scale make, model, and capacity, and get a price on the parts that fit.',
  canonical: '/quote',
  openGraph: { type: 'website' },
};

export default function QuoteRequest() {
  const { items, updateItem, removeItem, clear, restore } = useQuote();
  const [cleared, setCleared] = useState(null);
  const { contact, errors, change, blur, validate } = useContactForm();
  const [notes, setNotes] = useState('');
  const [sent, setSent] = useState(null);
  const [copied, setCopied] = useState(false);

  useSeo(metadata);

  // The label reverts on its own, so the button offers the copy again; a
  // permanent "Copied" reads as a dead control. The timer lives in an effect
  // rather than in the handler so leaving the page clears it.
  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  function handleSubmit(event) {
    event.preventDefault();
    const firstBad = validate();
    if (firstBad) {
      focusField(firstBad);
      return;
    }
    const request = buildQuoteRequest({ contact, items, notes });
    setSent(request);
    setCopied(false);
    window.location.href = request.mailto;
  }

  async function copyRequest() {
    if (!sent) return;
    try {
      await navigator.clipboard.writeText(`${sent.subject}\n\n${sent.body}`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Quote Request"
        title="Your quote list"
        intro="Every part you added, in one request. The more you can say about the scale, the closer the first reply gets to a final price."
      />

      <div className="container-page py-14 lg:py-20">
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-6 rounded-lg border-2 border-dashed border-line-strong bg-surface-sunken p-10 text-center">
            <div className="flex flex-col items-center gap-3">
              <PackageSearch
                size={iconSize.feature}
                className="text-ink-faint"
                aria-hidden="true"
              />
              <h2 className="text-xl">{cleared ? 'List cleared' : 'Nothing on the list yet'}</h2>
              {cleared ? (
                <p className="max-w-md text-ink-muted">
                  {`${cleared.length} ${cleared.length === 1 ? 'part is' : 'parts are'} off the list. Put them back if that was not what you meant.`}
                </p>
              ) : (
                <p className="max-w-md text-ink-muted">
                  Add parts from the catalog and they&apos;ll collect here until you send them.
                </p>
              )}
            </div>
            {/* Undo rather than a confirmation dialog: the action is one click to
                reverse, so making every visitor confirm it costs more than the
                mistake does. */}
            <div className="flex flex-col gap-3 sm:flex-row">
              {cleared && (
                <button
                  type="button"
                  onClick={() => {
                    restore(cleared);
                    setCleared(null);
                  }}
                  className="btn btn-lg btn-steel"
                >
                  <Undo2 size={iconSize.text} aria-hidden="true" />
                  Undo Clear
                </button>
              )}
              <Link to="/parts" className="btn btn-lg btn-primary">
                Browse Parts
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-start">
            <section aria-labelledby="items-heading" className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 id="items-heading" className="text-2xl">
                  Parts
                </h2>
                {/* Destruction hovers red; teal stays reserved for the send
                    action this page exists to produce. */}
                <button
                  type="button"
                  onClick={() => {
                    setCleared(items);
                    clear();
                  }}
                  className="font-display text-sm font-bold text-ink-faint transition-colors duration-fast hover:text-danger"
                >
                  Clear List
                </button>
              </div>

              <ul className="flex flex-col gap-6">
                {items.map((item) => (
                  <li key={item.slug} className="card flex flex-col gap-6 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-base">
                        <Link
                          to={`/parts/${item.slug}`}
                          className="transition-colors duration-fast hover:text-accent-text"
                        >
                          {item.name}
                        </Link>
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeItem(item.slug)}
                        className="icon-btn text-ink-faint hover:bg-danger-surface hover:text-danger"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={iconSize.text} aria-hidden="true" />
                      </button>
                    </div>

                    {/* The columns hold at every width: a full-width number input
                        for a two-digit value only makes phone rows taller. */}
                    <div className="grid grid-cols-[6.5rem_1fr] gap-4">
                      {/* Clamping waits for blur, so clearing the field to
                          retype does not snap it back to 1 mid-edit. */}
                      <FormField
                        id={`qty-${item.slug}`}
                        name="quantity"
                        label="Quantity"
                        type="number"
                        inputMode="numeric"
                        min="1"
                        className="tabular-nums"
                        value={item.quantity}
                        onChange={(event) =>
                          updateItem(item.slug, {
                            quantity:
                              event.target.value === ''
                                ? ''
                                : Math.max(1, Number(event.target.value) || 1),
                          })
                        }
                        onBlur={() => {
                          if (item.quantity === '') updateItem(item.slug, { quantity: 1 });
                        }}
                      />
                      <FormField
                        id={`details-${item.slug}`}
                        name="details"
                        label="Scale Details"
                        as="textarea"
                        rows="2"
                        hint="Make, model, capacity."
                        value={item.details}
                        onChange={(event) => updateItem(item.slug, { details: event.target.value })}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section
              aria-labelledby="contact-heading"
              className="flex flex-col gap-6 lg:sticky lg:top-28"
            >
              <h2 id="contact-heading" className="text-2xl">
                Where to Send the Quote
              </h2>
              {/* noValidate hands the messages to the form rather than to the
                  browser, so every field explains itself the same way in every
                  browser. */}
              <form onSubmit={handleSubmit} noValidate className="card flex flex-col gap-6 p-6">
                <FormErrorSummary errors={errors} labels={{ name: 'Name', email: 'Email' }} />
                <ContactFields contact={contact} errors={errors} onChange={change} onBlur={blur} />

                <FormField
                  id="notes"
                  label="Anything Else"
                  as="textarea"
                  rows="3"
                  hint="Timing, site access, purchase order requirements."
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />

                <div className="flex flex-col gap-3">
                  <button type="submit" className="btn btn-lg btn-primary w-full">
                    <Mail size={iconSize.text} aria-hidden="true" />
                    Send Quote Request
                  </button>
                  {/* The address is longer than the button, so it stays a
                      caption below it. Inside the label it takes the button to
                      two lines and gets split across them. */}
                  <p className="text-center text-sm text-ink-muted">
                    Opens your mail program addressed to{' '}
                    <span className="whitespace-nowrap font-medium text-ink-body">
                      {company.email.sales}
                    </span>
                  </p>
                </div>
              </form>

              {sent && (
                <div className="rise-in flex flex-col items-start gap-6 rounded-lg border border-line-strong bg-surface-sunken p-5">
                  <div className="flex w-full flex-col gap-3">
                    <h3 className="text-base">Your Request</h3>
                    <p className="text-sm leading-relaxed text-ink-muted">
                      If your mail program didn't open, copy this and send it to{' '}
                      {company.email.sales}.
                    </p>
                    <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded border border-line-strong bg-surface-raised p-4 font-sans text-sm text-ink-body">
                      {sent.body}
                    </pre>
                  </div>
                  {/* The pinned width keeps the button from resizing when the
                      label swaps to the shorter Copied. */}
                  <button
                    type="button"
                    onClick={copyRequest}
                    className="btn btn-md btn-outline min-w-[9.75rem]"
                  >
                    {copied ? (
                      <Check size={iconSize.text} aria-hidden="true" />
                    ) : (
                      <Copy size={iconSize.text} aria-hidden="true" />
                    )}
                    {copied ? 'Copied' : 'Copy Request'}
                  </button>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </>
  );
}
