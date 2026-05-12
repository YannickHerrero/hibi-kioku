import { THEMES, type Theme, useTheme } from "../lib/theme.ts";
import { SegmentedControl } from "./ui/SegmentedControl.tsx";

const OPTIONS = THEMES.map((t) => ({ value: t, label: t }));

export function ThemeSwitcher() {
  const [theme, setTheme] = useTheme();
  return (
    <SegmentedControl<Theme>
      ariaLabel="Theme"
      value={theme}
      options={OPTIONS}
      onChange={setTheme}
    />
  );
}
