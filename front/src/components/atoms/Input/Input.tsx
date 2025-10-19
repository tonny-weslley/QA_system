import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../../lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        className={cn(
          'flex h-10 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder:text-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-halloween-purple focus:ring-offset-2 focus:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-colors',
          error && 'border-error focus:ring-error',
          className
        )}
        ref={ref}
        aria-invalid={!!error}
        aria-describedby={error ? `${props.id}-error` : undefined}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
