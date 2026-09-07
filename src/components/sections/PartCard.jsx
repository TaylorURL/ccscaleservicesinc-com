import { Link } from 'react-router-dom';
import { ArrowRight, Check, Plus } from 'lucide-react';
import { categoryBySlug } from '../../content/part-categories';
import { useQuote } from '../../lib/quote-context';
import { iconSize } from '../../lib/icon-size';

export default function PartCard({ part }) {
  const { addItem, has } = useQuote();
  const onList = has(part.slug);
  const category = categoryBySlug[part.category];

  return (
    <article className="card card-lift flex flex-col gap-6 p-6">
      <div className="flex flex-1 flex-col gap-3">
        <p className="eyebrow">{category?.name}</p>
        <h3 className="text-lg">
          <Link
            to={`/parts/${part.slug}`}
            className="transition-colors duration-fast hover:text-accent-text"
          >
            {part.name}
          </Link>
        </h3>
        <p className="text-sm leading-relaxed text-ink-muted">{part.summary}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => addItem(part)}
          className={`btn btn-md ${onList ? 'btn-outline' : 'btn-steel'}`}
          disabled={onList}
        >
          {onList ? (
            <>
              <Check size={iconSize.text} aria-hidden="true" /> On List
            </>
          ) : (
            <>
              <Plus size={iconSize.text} aria-hidden="true" /> Add to Quote
            </>
          )}
        </button>
        <Link
          to={`/parts/${part.slug}`}
          className="inline-flex items-center gap-2 font-display text-sm font-bold text-ink-body transition-colors duration-fast hover:text-accent-text"
        >
          Details
          <ArrowRight size={iconSize.chrome} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
