import { useId } from "react";
import "./SegmentedControl.css";

interface Option<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  value: T;
  options: ReadonlyArray<Option<T>>;
  onChange: (next: T) => void;
  ariaLabel?: string;
  className?: string;
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  className,
}: SegmentedControlProps<T>) {
  const name = useId();
  return (
    <fieldset aria-label={ariaLabel} className={["seg", className].filter(Boolean).join(" ")}>
      {options.map((opt) => {
        const active = opt.value === value;
        const id = `${name}-${opt.value}`;
        return (
          <label
            key={opt.value}
            htmlFor={id}
            className={["seg-option", active ? "is-active" : ""].filter(Boolean).join(" ")}
          >
            <input
              id={id}
              type="radio"
              name={name}
              value={opt.value}
              checked={active}
              onChange={() => onChange(opt.value)}
            />
            <span>{opt.label}</span>
          </label>
        );
      })}
    </fieldset>
  );
}
