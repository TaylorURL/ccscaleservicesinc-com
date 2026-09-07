import { AlertCircle, ChevronDown } from 'lucide-react';
import { iconSize } from '../../lib/icon-size';

/**
 * One label, one control, one message slot, at one rhythm - and the control
 * itself, so every field on the site is the same field. Defining it once is what
 * keeps the contact form and the quote form from drifting apart the first time
 * one of them is touched.
 *
 * Guidance goes in the hint below the control rather than in a placeholder,
 * because a placeholder is gone the moment there is anything in the field, which
 * is exactly when someone is still deciding whether they answered it properly.
 *
 * The message slot is reserved whether or not there is a message. Collapsing it
 * would move every field below the one that failed at the moment the reader is
 * reading it.
 */
export default function FormField({
  id,
  name,
  label,
  as = 'input',
  type = 'text',
  required = false,
  hint,
  error,
  className = '',
  children,
  ...control
}) {
  const described = [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(' ');

  const shared = {
    id,
    name: name || id,
    required,
    'aria-required': required || undefined,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': described || undefined,
    ...control,
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="field-label">
        {label}
        {required && (
          <span className="ml-1 text-danger" aria-hidden="true">
            *
          </span>
        )}
        {required && <span className="sr-only"> (required)</span>}
      </label>

      {as === 'select' ? (
        <div className="relative">
          <select {...shared} className={`field field-select ${className}`.trim()}>
            {children}
          </select>
          <ChevronDown size={iconSize.text} className="field-select-chevron" aria-hidden="true" />
        </div>
      ) : as === 'textarea' ? (
        <textarea {...shared} className={`field resize-y ${className}`.trim()} />
      ) : (
        <input {...shared} type={type} className={`field ${className}`.trim()} />
      )}

      {hint && (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      )}
      {/* role="alert" only once there is something to announce, so a screen
          reader is not handed an empty region on every render. */}
      <p id={`${id}-error`} className="field-error" role={error ? 'alert' : undefined}>
        {error && (
          <>
            <span className="icon-lead">
              <AlertCircle size={iconSize.text} aria-hidden="true" />
            </span>
            {error}
          </>
        )}
      </p>
    </div>
  );
}
