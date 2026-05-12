type Variant = "default" | "soft" | "double";

interface RuleProps {
  variant?: Variant;
  className?: string;
}

export function Rule({ variant = "default", className }: RuleProps) {
  const cls = variant === "default" ? "rule" : variant === "soft" ? "rule-soft" : "rule-double";
  return <hr className={[cls, className].filter(Boolean).join(" ")} />;
}
