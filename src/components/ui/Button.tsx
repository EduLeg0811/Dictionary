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
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-sky-900 text-white hover:bg-sky-800 focus:ring-sky-500',
    secondary: 'bg-stone-100 text-stone-700 hover:bg-stone-200 focus:ring-stone-400',
    ghost: 'text-stone-600 hover:bg-stone-50 focus:ring-stone-400',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-base',
  };

  const activeStyles = isActive ? 'ring-2 ring-sky-500 ring-offset-2' : '';

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
