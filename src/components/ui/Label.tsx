import type { HTMLAttributes } from "react";

interface LabelProps extends HTMLAttributes<HTMLSpanElement> {
  num?: string;
}

export function Label({ num, children, className, ...rest }: LabelProps) {
  return (
    <span className={["label", className].filter(Boolean).join(" ")} {...rest}>
      {num ? <span className="num">{num}</span> : null}
      {children}
    </span>
  );
}
