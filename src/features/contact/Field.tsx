import type { ReactNode } from 'react';

interface FieldProps {
  id: string;
  label: string;
  children: ReactNode;
  hint?: string;
  error?: string;
  required?: boolean;
}

/**
 * Visible label, persistent hint, inline error below the input.
 *
 * The error is a live region so a screen reader hears it without focus moving,
 * and it is wired to the input through `aria-describedby` by convention: the
 * hint id and error id are derived from the field id.
 */
export function Field({
  id,
  label,
  children,
  hint,
  error,
  required = false,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
        {required ? (
          <span aria-hidden className="text-accent-strong">
            {' *'}
          </span>
        ) : null}
      </label>

      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-sm text-teal-body">
          {hint}
        </p>
      ) : null}

      <div className="mt-2">{children}</div>

      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-accent-strong">
          {error}
        </p>
      ) : null}
    </div>
  );
}
