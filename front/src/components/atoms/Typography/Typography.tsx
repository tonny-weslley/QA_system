import { HTMLAttributes } from 'react';
import { cn } from '../../../lib/utils';

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'small';
  gradient?: boolean;
}

export const Typography = ({
  variant = 'p',
  gradient = false,
  className,
  children,
  ...props
}: TypographyProps) => {
  const baseStyles = 'font-inter';

  const variants = {
    h1: 'text-4xl md:text-5xl font-bold font-creepster',
    h2: 'text-3xl md:text-4xl font-bold font-creepster',
    h3: 'text-2xl md:text-3xl font-semibold',
    h4: 'text-xl md:text-2xl font-semibold',
    p: 'text-base',
    small: 'text-sm text-gray-400',
  };

  const Component = variant === 'p' || variant === 'small' ? 'p' : variant;

  return (
    <Component
      className={cn(
        baseStyles,
        variants[variant],
        gradient && 'text-halloween-gradient',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
