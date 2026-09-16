import { useState } from 'react';
import { Check, Copy, Mail, MapPin, Phone } from 'lucide-react';
import ContactFields from '../components/forms/ContactFields';
import FormErrorSummary from '../components/forms/FormErrorSummary';
import FormField from '../components/forms/FormField';
import PageHeader from '../components/sections/PageHeader';
import { addressLine, company, hasAddress, phoneHref } from '../content/company';
import { services } from '../content/services';
import { focusField, useContactForm } from '../lib/contact-form';
import { buildServiceRequest, useSentRequest } from '../lib/request-email';
import { useSeo } from '../lib/seo';
import { localBusinessSchema } from '../lib/structured-data';
import { iconSize } from '../lib/icon-size';

export const metadata = {
  title: 'Contact Us for Scale Service or a Parts Quote',
  description:
    'Reach Compound Industrial Scale Services for calibration, repair, or parts. Call 346-885-5159, or send the scale make, model, and symptom with the form.',
  canonical: '/contact',
  openGraph: { type: 'website' },
};

export default function Contact() {
  const { contact, errors, change, blur, validate } = useContactForm();
  const [service, setService] = useState('');
  const [message, setMessage] = useState('');
  const [messageError, setMessageError] = useState('');
  const { sent, copied, send, copyRequest } = useSentRequest();

  useSeo(metadata, localBusinessSchema());

  function checkMessage(value) {
    return value.trim()
      ? ''
      : "Say what the scale is and what it's doing, so the right parts come out with the technician.";
  }

  function handleSubmit(event) {
    event.preventDefault();
    const problem = checkMessage(message);
    setMessageError(problem);
    // Focus lands on the first thing that needs fixing rather than leaving the
    // reader to find it, which on a phone means scrolling back up a full screen.
    const firstBad = validate(problem ? { message: problem } : {});
    if (firstBad) {
      focusField(firstBad);
      return;
    }
    send(buildServiceRequest({ contact, service, message }));
  }

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Request service or a quote"
        intro="Tell us the make, the model, and what the scale is doing. That gets a technician out to you with the likely parts already on the truck."
      />

      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1.3fr_1fr] lg:py-20">
        {/* noValidate hands the messages to the form rather than to the browser,
            so every field explains itself the same way in every browser. */}
        <form onSubmit={handleSubmit} noValidate className="card flex flex-col gap-6 p-6 lg:p-8">
          <FormErrorSummary
            errors={{ ...errors, message: messageError }}
            labels={{ name: 'Name', email: 'Email', message: 'Scale and Symptom' }}
          />
          <ContactFields contact={contact} errors={errors} onChange={change} onBlur={blur} />

          <FormField
            id="service"
            label="Service Needed"
            as="select"
            value={service}
            onChange={(event) => setService(event.target.value)}
          >
            <option value="">Select a Service</option>
            {services.map((item) => (
              <option key={item.slug} value={item.name}>
                {item.name}
              </option>
            ))}
            <option value="Something Else">Something Else</option>
          </FormField>

          <FormField
            id="message"
            label="Scale and Symptom"
            as="textarea"
            rows="6"
            required
            error={messageError}
            hint="Make, model, capacity, and what it's doing wrong. Add the site location if the work is on site."
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              if (messageError) setMessageError('');
            }}
            onBlur={(event) => setMessageError(checkMessage(event.target.value))}
          />

          <button type="submit" className="btn btn-lg btn-primary w-full self-start sm:w-auto">
            <Mail size={iconSize.text} aria-hidden="true" />
            Send Request
          </button>

          {sent && (
            <div className="rise-in flex flex-col items-start gap-6 rounded-lg border border-line-strong bg-surface-sunken p-5">
              <div className="flex w-full flex-col gap-3">
                <h2 className="text-base">Your Request</h2>
                <p className="text-sm leading-relaxed text-ink-muted">
                  If your mail program didn't open, copy this and send it to {company.email.sales}.
                </p>
                <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded border border-line-strong bg-surface-raised p-4 font-sans text-sm text-ink-body">
                  {sent.body}
                </pre>
              </div>
              {/* The pinned width keeps the button from resizing when the label
                  swaps to the shorter Copied. */}
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
        </form>

        {/* Where the two columns sit side by side the form runs several screens
            past this one, so without this the phone number scrolls out of reach
            at the point where someone gives up on typing and decides to call. */}
        <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
          <div className="card flex flex-col gap-6 p-6">
            <h2 className="text-lg">Reach Us Directly</h2>
            <ul className="flex flex-col gap-6 text-sm">
              {company.phone && (
                <li className="flex items-start gap-3">
                  <span className="icon-lead text-accent-text">
                    <Phone size={iconSize.text} aria-hidden="true" />
                  </span>
                  <div>
                    <a
                      href={phoneHref}
                      className="font-display font-bold text-ink transition-colors duration-fast hover:text-accent-text"
                    >
                      {company.phone}
                    </a>
                    <p className="text-ink-muted">On-call support around the clock</p>
                  </div>
                </li>
              )}
              <li className="flex items-start gap-3">
                <span className="icon-lead text-accent-text">
                  <Mail size={iconSize.text} aria-hidden="true" />
                </span>
                <div>
                  <a
                    href={`mailto:${company.email.sales}`}
                    className="font-display font-bold text-ink transition-colors duration-fast hover:text-accent-text"
                  >
                    {company.email.sales}
                  </a>
                  <p className="text-ink-muted">Service, parts, and quotes</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="icon-lead text-accent-text">
                  <Mail size={iconSize.text} aria-hidden="true" />
                </span>
                <div>
                  <a
                    href={`mailto:${company.email.office}`}
                    className="font-display font-bold text-ink transition-colors duration-fast hover:text-accent-text"
                  >
                    {company.email.office}
                  </a>
                  <p className="text-ink-muted">Billing and accounts</p>
                </div>
              </li>
              {hasAddress && (
                <li className="flex items-start gap-3">
                  <span className="icon-lead text-accent-text">
                    <MapPin size={iconSize.text} aria-hidden="true" />
                  </span>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(addressLine)}`}
                    className="text-ink-body transition-colors duration-fast hover:text-accent-text"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {addressLine}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {company.hours.length > 0 && (
            <div className="card flex flex-col gap-6 p-6">
              <h2 className="text-lg">Hours</h2>
              <dl className="flex flex-col gap-3 text-sm">
                {company.hours.map((entry) => (
                  <div key={entry.days} className="flex justify-between gap-4">
                    <dt className="text-ink-muted">{entry.days}</dt>
                    <dd className="font-medium tabular-nums text-ink">{entry.hours}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {company.serviceArea.length > 0 && (
            <div className="card flex flex-col gap-6 p-6">
              <h2 className="text-lg">Service Area</h2>
              <ul className="flex flex-wrap gap-3">
                {company.serviceArea.map((area) => (
                  <li
                    key={area}
                    className="rounded border border-line bg-surface-sunken px-3 py-2 text-sm text-ink-body"
                  >
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
