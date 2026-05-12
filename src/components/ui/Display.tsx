import type { HTMLAttributes } from "react";

type Size = "xl" | "lg" | "md" | "sm";

interface DisplayProps extends HTMLAttributes<HTMLHeadingElement> {
  size?: Size;
  italic?: boolean;
  as?: "h1" | "h2" | "h3" | "div";
}

const SIZE_VAR: Record<Size, string> = {
  xl: "var(--t-display-xl)",
  lg: "var(--t-display-lg)",
  md: "var(--t-display-md)",
  sm: "var(--t-display-sm)",
};

export function Display({
  size = "lg",
  italic,
  as: Tag = "h1",
  className,
  style,
  ...rest
}: DisplayProps) {
  const cls = ["display", italic ? "italic" : "", className].filter(Boolean).join(" ");
  return <Tag className={cls} style={{ fontSize: SIZE_VAR[size], ...style }} {...rest} />;
}
