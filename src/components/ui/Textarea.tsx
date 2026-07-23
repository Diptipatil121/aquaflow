import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-');
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm min-h-[100px] resize-y',
            'placeholder:text-slate-400 transition-colors',
            'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
            'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
            error && 'border-danger',
            className
          )}
          aria-invalid={!!error}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-danger" role="alert">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
