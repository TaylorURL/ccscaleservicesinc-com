import { company } from '../../content/company';

/**
 * The company mark next to the name. The shield is vector on a transparent
 * ground, so it stays sharp at any density and sits as cleanly on the dark
 * footer as on the light header. The name is HTML text rather than part of the
 * image, so it scales with the layout, wraps on phones, and reads to search
 * engines and screen readers as text. The raster lockup with the name baked in
 * is public/brand/logo-297.webp, for a light ground with room to give it.
 *
 * The two tones are the two grounds the mark sits on, not two colors: `dark`
 * takes the wordmark tokens, which follow the theme, and `light` takes the
 * inverse ink used everywhere else on the brand's dark bands.
 */
export default function Wordmark({ tone = 'dark', compact = false }) {
  const nameTone = tone === 'light' ? 'text-ink-inverse' : 'text-wordmark';
  const subTone = tone === 'light' ? 'text-ink-inverse-muted' : 'text-wordmark-sub';

  return (
    <span className="flex items-center gap-3">
      <img
        src="/brand/mark.svg"
        alt=""
        width="40"
        height="40"
        className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
      />
      <span className="flex min-w-0 flex-col gap-1">
        {/* The name is long enough to need two lines on a phone, so it wraps
            with a tight leading instead of shrinking to an unreadable size. */}
        <span
          className={`font-display text-sm font-extrabold leading-tight tracking-tight sm:text-base lg:text-lg ${nameTone}`}
        >
          {company.name}
        </span>
        {/* The strapline is a descriptor and the controls beside it in the bar
            are not, so the compact lockup drops it: a second line of type in the
            bar puts the name and the nav on different baselines and takes the
            bar past the height it is allowed. The footer has the room and keeps
            it at every width. */}
        {!compact && (
          <span
            className={`block font-display text-micro font-bold uppercase tracking-eyebrow ${subTone}`}
          >
            Calibration · Repair · Parts
          </span>
        )}
      </span>
    </span>
  );
}
