import { cn } from "@/lib/cn";

/** Shared text-input styling for the contact form and checkout. */
export const inputClass =
  "w-full rounded-lg border border-forest/15 bg-white px-3 py-2 text-sm leading-6 text-forest placeholder:text-forest/35 focus:border-moss focus:outline-none";

export function Field({
  label,
  name,
  required,
  className,
  hint,
  error,
  idPrefix = "f",
  ...rest
}: {
  label: string;
  name: string;
  required?: boolean;
  className?: string;
  /** One line under the input. */
  hint?: string;
  /** Validation message; also marks the input invalid for assistive tech. */
  error?: string;
  idPrefix?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = `${idPrefix}-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-forest">
        {label} {required && <span className="text-clay">*</span>}
      </label>
      <input
        id={id}
        name={name}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(inputClass, "h-10", error && "border-clay focus:border-clay")}
        {...rest}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-clay">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-forest/50">{hint}</p>
      ) : null}
    </div>
  );
}
