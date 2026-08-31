import { Moon, Sun, SunMoon } from 'lucide-react';
import { THEMES, useTheme } from '../lib/theme';
import { iconSize } from '../lib/icon-size';

const ICONS = { light: Sun, dark: Moon, gray: SunMoon };

/**
 * A segmented control rather than a cycling button: three themes behind one
 * button means two presses to reach the third and no way to see which is on.
 * The current one is marked by fill and by aria-pressed, so it does not rest on
 * color alone.
 */
export default function ThemeToggle() {
  const { theme, choose } = useTheme();

  return (
    <div
      className="flex items-center gap-1 rounded border border-line-inverse p-1"
      role="group"
      aria-label="Theme"
    >
      {THEMES.map((option) => {
        const Icon = ICONS[option.value];
        const active = theme === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => choose(active ? null : option.value)}
            title={`${option.label} Theme`}
            className={`icon-btn ${
              active
                ? 'bg-accent-inverse text-surface-inverse hover:bg-ink-inverse'
                : 'text-ink-inverse-faint hover:text-ink-inverse'
            }`}
          >
            <Icon size={iconSize.text} aria-hidden="true" />
            <span className="sr-only">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
