import type { InputHTMLAttributes } from 'react';

export function FormField({
  label,
  error,
  ...input
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string | undefined }) {
  const errorId = `${input.id}-error`;
  return (
    <div className="field">
      <label htmlFor={input.id}>{label}</label>
      <input {...input} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} />
      {error && <p id={errorId} className="field-error">{error}</p>}
    </div>
  );
}
