import { AlertCircle } from 'lucide-react';
import { iconSize } from '../../lib/icon-size';

/**
 * Three messages spread down a long form are three things to hunt for. Past one
 * error, the form says how many there are at the top and links to each, so the
 * way through is a list rather than a scroll.
 *
 * It renders nothing for a single error: the field's own message is already the
 * whole story, and a summary repeating it is clutter.
 */
export default function FormErrorSummary({ errors, labels }) {
  const failed = Object.keys(labels).filter((field) => errors[field]);
  if (failed.length < 2) return null;

  return (
    <div
      role="alert"
      className="rise-in flex flex-col gap-3 rounded border border-danger bg-danger-surface p-4"
    >
      <p className="flex items-center gap-2 font-display text-sm font-bold text-danger">
        <AlertCircle size={iconSize.text} aria-hidden="true" />
        {failed.length} fields need fixing
      </p>
      <ul className="flex flex-col gap-2 text-sm">
        {failed.map((field) => (
          <li key={field}>
            <a href={`#${field}`} className="text-danger underline">
              {labels[field]}: {errors[field]}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
