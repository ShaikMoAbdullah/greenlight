import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

/** Shared input styling used by every text-like form control. */
export const controlClassName =
  "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

const labelClassName = "mb-1.5 block text-sm font-medium text-slate-700";

function Label({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className={labelClassName}>
      {children}
    </label>
  );
}

type WithLabel = { id: string; label: ReactNode };

export function TextField({
  id,
  label,
  className,
  ...props
}: WithLabel & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <input id={id} className={`${controlClassName} ${className ?? ""}`} {...props} />
    </div>
  );
}

export function TextAreaField({
  id,
  label,
  className,
  ...props
}: WithLabel & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <textarea
        id={id}
        className={`${controlClassName} resize-none ${className ?? ""}`}
        {...props}
      />
    </div>
  );
}

export function SelectField({
  id,
  label,
  className,
  children,
  ...props
}: WithLabel & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <select id={id} className={`${controlClassName} ${className ?? ""}`} {...props}>
        {children}
      </select>
    </div>
  );
}
