/**
 * The three sizes a glyph is drawn at, named by what it sits next to.
 *
 * lucide-react takes the size as a number on every icon, so without a set to
 * reach for, each call site picks its own and the same chevron ends up drawn at
 * four sizes a pixel or two apart.
 *
 * `chrome` is for a glyph that marks a direction or a state beside small type -
 * the utility strip, a breadcrumb separator, a disclosure chevron, the arrow at
 * the end of a link. `text` is for a glyph that carries meaning of its own set
 * beside a line of type or inside a control, which is the default and the size
 * the `.icon-lead` and `.icon-btn` rules are built around. `feature` is the one
 * large glyph an empty state puts above its message.
 */
export const iconSize = Object.freeze({
  chrome: 14,
  text: 17,
  feature: 28,
});
