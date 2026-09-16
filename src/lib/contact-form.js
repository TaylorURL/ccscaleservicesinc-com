import { useCallback, useState } from 'react';

/**
 * The four identity fields are asked for on both the contact form and the quote
 * form, so who is asking, what counts as an answer, and what a reader is told
 * when it is not one all live here rather than in each page.
 *
 * Messages name the cause and the fix, because "Invalid input" tells a reader
 * that something is wrong and nothing about what to do next.
 */

const emptyContact = { name: '', company: '', email: '', phone: '' };

/** Ordered, so a failed submit can move focus to the first field that needs work. */
const contactFieldOrder = ['name', 'company', 'email', 'phone'];

// Deliberately loose: the only thing worth catching here is an address that
// cannot reach anybody. Anything stricter rejects addresses that do.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateContact(contact) {
  const errors = {};
  if (!contact.name.trim()) {
    errors.name = "Add your name so we know who's asking.";
  }
  if (!contact.email.trim()) {
    errors.email = 'Add an email address so the reply has somewhere to go.';
  } else if (!EMAIL.test(contact.email.trim())) {
    errors.email = 'That address is missing an @ or a domain. Check it and try again.';
  }
  return errors;
}

/**
 * Holds the contact block for a page, validates a field once the reader has
 * finished with it rather than on every keystroke, and hands back the first
 * field that needs attention after a failed submit.
 */
export function useContactForm(extraValidate) {
  const [contact, setContact] = useState(emptyContact);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const change = useCallback((field, value) => {
    setContact((current) => ({ ...current, [field]: value }));
    // A field already showing a message re-checks as it is typed, so the message
    // clears the moment it stops being true.
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }, []);

  const blur = useCallback(
    (field) => {
      setTouched((current) => ({ ...current, [field]: true }));
      setContact((current) => {
        const found = { ...validateContact(current), ...(extraValidate?.(current) || {}) };
        setErrors((existing) => ({ ...existing, [field]: found[field] }));
        return current;
      });
    },
    [extraValidate]
  );

  /** @returns {string|null} the first field that failed, or null when the form is good. */
  const validate = useCallback(
    (extra = {}) => {
      const found = { ...validateContact(contact), ...extra };
      setErrors(found);
      setTouched(contactFieldOrder.reduce((all, field) => ({ ...all, [field]: true }), {}));
      const order = [...contactFieldOrder, ...Object.keys(extra)];
      return order.find((field) => found[field]) || null;
    },
    [contact]
  );

  return { contact, errors, touched, change, blur, validate };
}

/** Moves focus and the viewport to the field a reader has to fix. */
export function focusField(id) {
  const element = document.getElementById(id);
  if (element) element.focus();
}
