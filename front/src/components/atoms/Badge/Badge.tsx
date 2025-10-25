import { HTMLAttributes } from 'react';
import { cn } from '../../../lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'easy' | 'medium' | 'hard' | 'success' | 'error' | 'warning' | 'default';
}

export const Badge = ({ className, variant = 'default', children, ...props }: BadgeProps) => {
  const variants = {
    easy: 'bg-green-500/20 text-green-400 border-green-500/30',
    medium: 'bg-halloween-orange/20 text-halloween-orange border-halloween-orange/30',
    hard: 'bg-red-500/20 text-red-400 border-red-500/30',
    success: 'bg-success/20 text-success border-success/30',
    error: 'bg-error/20 text-error border-error/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    default: 'bg-gray-700/50 text-gray-300 border-gray-600/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
