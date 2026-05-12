import type { InputHTMLAttributes } from "react";
import "./Field.css";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export function Field({ label, hint, error, className, id, ...rest }: FieldProps) {
  const inputId = id ?? rest.name;
  return (
    <label className={["field", className].filter(Boolean).join(" ")} htmlFor={inputId}>
      {label ? <span className="field-label">{label}</span> : null}
      <input id={inputId} className="field-input" {...rest} />
      {error ? <span className="field-error">{error}</span> : null}
      {!error && hint ? <span className="field-hint">{hint}</span> : null}
    </label>
  );
}
