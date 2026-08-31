/**
 * The dark band at the top of every page below the home page. It carries the
 * same grid texture as the home hero so the band reads as the same material
 * everywhere, not a flat imitation of it.
 *
 * Every gap lives on a container rather than on the element below it, because
 * three of the four children are optional: a margin belonging to the survivor
 * leaves a hole the size of the missing one. The nesting is the grouping -
 * label to title is the tightest step, title to intro is one step wider, and the
 * actions sit a step wider again.
 */
export default function PageHeader({ eyebrow, title, intro, children }) {
  return (
    <section data-hero="band" className="relative overflow-hidden bg-surface-inverse-wash">
      <div className="absolute inset-0 bg-grid bg-grid-tile opacity-60" aria-hidden="true" />
      <div className="container-page relative flex flex-col items-start gap-8 pb-16 pt-12 lg:pb-24 lg:pt-16">
        <div className="flex flex-col items-start gap-5">
          <div className="flex flex-col items-start gap-3">
            {/* The shared eyebrow accent is tuned for the light pages; the dark
                band needs the lighter step to stay readable. */}
            {eyebrow && (
              <p data-hero="eyebrow" className="eyebrow text-accent-inverse">
                {eyebrow}
              </p>
            )}
            <h1 className="max-w-3xl text-3xl text-ink-inverse sm:text-4xl lg:text-5xl">{title}</h1>
          </div>
          {intro && (
            <p
              data-hero="intro"
              className="max-w-prose text-lg leading-relaxed text-ink-inverse-muted"
            >
              {intro}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
