import type { ButtonHTMLAttributes } from "react";
import "./Button.css";

type Variant = "primary" | "ghost" | "outline";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant = "outline",
  size = "md",
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  const classes = ["btn", `btn-${variant}`, `btn-${size}`, className].filter(Boolean).join(" ");
  return <button type={type} className={classes} {...rest} />;
}
