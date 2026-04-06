import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-400 shadow-sm shadow-slate-100/70 transition-all duration-200 focus:border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-200 ${error ? 'border-rose-300 focus:border-rose-200 focus:ring-rose-200' : ''} ${className}`}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-rose-700">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
