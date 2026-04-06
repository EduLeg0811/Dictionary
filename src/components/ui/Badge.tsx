import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info' | 'subtle';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'md', className = '' }: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full border';

  const variantStyles = {
    default: 'border-slate-200 bg-slate-100/70 text-slate-700',
    success: 'border-emerald-200 bg-emerald-50/80 text-emerald-800',
    warning: 'border-amber-200 bg-amber-50/80 text-amber-800',
    info: 'border-blue-200 bg-blue-50/80 text-blue-800',
    subtle: 'border-slate-200 bg-white/80 text-slate-600',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
}
