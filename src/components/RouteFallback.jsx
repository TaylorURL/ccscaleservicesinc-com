/**
 * Stands in for a route while its code downloads.
 *
 * Seven of the ten routes open with PageHeader's dark band: an eyebrow, a
 * heading, and an intro, in a container with a fixed rhythm. So this is that
 * band, with the type replaced by the space the type occupies - same ground,
 * same texture, same padding, same gaps, same three blocks. Measured against a
 * route that has landed, the two boxes sit in the same place at the same size,
 * which is the whole point: the page below does not travel up when the chunk
 * arrives. A change to PageHeader's container belongs here in the same edit.
 *
 * The bars carry no radius because the lines they stand in for carry none. A
 * rounded bar is a shape the content never takes, and the difference shows at
 * the moment of the swap.
 *
 * The whole block is held at zero opacity for the first fifth of a second,
 * which is longer than a warm cache takes: a chunk that arrives in that window
 * is never announced by a flash of grey, and a chunk that does not still fills
 * the screen rather than leaving it blank.
 */
export default function RouteFallback() {
  return (
    <section
      role="status"
      aria-busy="true"
      data-skeleton="hero"
      className="skeleton-in relative overflow-hidden bg-surface-inverse-wash"
    >
      <div className="absolute inset-0 bg-grid bg-grid-tile opacity-60" aria-hidden="true" />
      <div className="container-page relative flex flex-col items-start gap-8 pb-16 pt-12 lg:pb-24 lg:pt-16">
        <span className="sr-only">Loading the page</span>
        <div className="flex w-full flex-col items-start gap-5">
          <div className="flex w-full flex-col items-start gap-3">
            {/* Sized to the eyebrows the routes actually set, which run from
                "Parts" to "Services" - 47 to 80 pixels at this step. */}
            <div data-skeleton="eyebrow" className="media-frame h-4 w-20" aria-hidden="true" />
            {/* Two lines of the heading's own step, and the width the heading
                itself is capped at. The bars carry w-full because the columns
                above them shrink to their content, and a bar holds no content
                to give it width. */}
            <div
              data-skeleton="headline"
              className="media-frame h-24 w-full max-w-3xl"
              aria-hidden="true"
            />
          </div>
          {/* Two lines of the intro's own type - text-lg at leading-relaxed -
              rather than a height picked to look about right. The bar is set in
              that type too, so its max-w-prose counts the same 65 characters
              the intro's does rather than 65 of the inherited step. */}
          <div
            data-skeleton="intro"
            className="media-frame h-[calc(2*1.625*1.125rem)] w-full max-w-prose text-lg"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
