/**
 * The palette lives in src/index.css as custom properties, in three layers:
 * primitive ramps, semantic aliases, and the component classes that consume
 * them. This file is the Tailwind view of that same source rather than a second
 * copy of it, so every utility below resolves to a token that a theme can
 * rewrite. Nothing here holds a colour value of its own.
 */
const token = (name) => `var(--${name})`;

const steel = Object.fromEntries(
  [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((step) => [
    step,
    token(`steel-${step}`),
  ])
);

const teal = Object.fromEntries(
  [300, 400, 500, 600, 700].map((step) => [step, token(`teal-${step}`)])
);

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  future: {
    // Wraps every hover: variant in @media (hover: hover), so taps on touch
    // devices do not leave hover states stuck on.
    hoverOnlyWhenSupported: true,
  },
  theme: {
    // Declared outside `extend`, which drops Tailwind's numeric scale: z-40 no
    // longer compiles, so a layer is chosen by name against the others rather
    // than by a number picked at the point of use. `behind` is the one step
    // below its own stacking context, for a scrim a positioned parent owns.
    zIndex: {
      auto: 'auto',
      behind: token('layer-behind'),
      base: token('layer-base'),
      sticky: token('layer-sticky'),
      dropdown: token('layer-dropdown'),
      'sticky-nav': token('layer-sticky-nav'),
      overlay: token('layer-overlay'),
      modal: token('layer-modal'),
      toast: token('layer-toast'),
    },
    extend: {
      colors: {
        steel,
        teal,

        surface: {
          DEFAULT: token('surface'),
          raised: token('surface-raised'),
          sunken: token('surface-sunken'),
          field: token('surface-field'),
          veil: token('surface-veil'),
          inverse: token('surface-inverse'),
        },
        ink: {
          DEFAULT: token('ink'),
          body: token('ink-body'),
          muted: token('ink-muted'),
          faint: token('ink-faint'),
          inverse: token('ink-inverse'),
          'inverse-muted': token('ink-inverse-muted'),
          'inverse-faint': token('ink-inverse-faint'),
        },
        line: {
          DEFAULT: token('line'),
          strong: token('line-strong'),
          field: token('line-field'),
          inverse: token('line-inverse'),
          'inverse-strong': token('line-inverse-strong'),
        },
        accent: {
          DEFAULT: token('accent'),
          hover: token('accent-hover'),
          ink: token('accent-ink'),
          text: token('accent-text'),
          inverse: token('accent-inverse'),
        },
        action: {
          DEFAULT: token('action'),
          hover: token('action-hover'),
          ink: token('action-ink'),
        },
        danger: {
          DEFAULT: token('danger'),
          surface: token('danger-surface'),
          ring: token('danger-ring'),
        },
        wordmark: {
          DEFAULT: token('wordmark'),
          sub: token('wordmark-sub'),
        },
        focus: token('focus'),
        'field-ring': token('field-ring'),
        placeholder: token('placeholder-fill'),
        'brand-plate': token('brand-plate'),
        overlay: token('overlay'),
      },
      // The re-metricked local face sits directly behind each web font, so the
      // text is set in something the same size from the first paint and the
      // swap moves nothing.
      fontFamily: {
        sans: [
          'Inter',
          'Inter Fallback',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        display: ['Archivo', 'Archivo Fallback', 'Inter', 'system-ui', 'sans-serif'],
      },
      // The micro step is where the eyebrow labels inside the nav panels and the
      // wordmark strapline sit. Named here rather than written as an arbitrary
      // value at each of the five call sites, so it is a step on the scale
      // rather than five numbers that happen to agree.
      fontSize: {
        micro: ['0.625rem', { lineHeight: '1rem' }],
      },
      letterSpacing: {
        eyebrow: '0.18em',
      },
      maxWidth: {
        prose: '68ch',
      },
      height: {
        header: token('header-height'),
      },
      // One key, so a button, an input, a select, and an icon button all reach
      // the same number instead of each repeating it.
      minHeight: {
        control: token('control-height'),
      },
      minWidth: {
        control: token('control-height'),
      },
      spacing: {
        header: token('header-height'),
      },
      boxShadow: {
        card: token('shadow-card'),
        'card-hover': token('shadow-card-hover'),
      },
      transitionDuration: {
        fast: token('duration-fast'),
        base: token('duration-base'),
      },
      transitionTimingFunction: {
        // The stock CSS easings are too weak to read as intentional at 150-200ms.
        // This curve decelerates hard, so a state change lands as an answer to
        // the press rather than as a slide.
        'quart-out': token('ease-quart-out'),
      },
      backgroundSize: {
        // Not `grid`: backgroundImage already claims that key, and both emit the
        // same .bg-grid class.
        'grid-tile': `${token('grid-size')} ${token('grid-size')}`,
      },
      backgroundImage: {
        'surface-inverse-wash': token('surface-inverse-wash'),
        'surface-scrim': token('surface-scrim'),
        grid: token('grid-image'),
      },
    },
  },
  plugins: [],
};
