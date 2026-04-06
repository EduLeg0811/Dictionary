import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isActive?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isActive = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 disabled:cursor-not-allowed disabled:opacity-50';

  const variantStyles = {
    primary: 'bg-slate-700 text-white hover:bg-slate-800 focus:ring-slate-400',
    secondary: 'border border-slate-200 bg-slate-100/80 text-slate-700 hover:bg-slate-200/80 focus:ring-slate-300',
    ghost: 'text-slate-600 hover:bg-slate-100/70 focus:ring-slate-300',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-base',
  };

  const activeStyles = isActive ? 'border-blue-200 bg-blue-50/90 text-blue-900 ring-2 ring-blue-200 ring-offset-2' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${activeStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
