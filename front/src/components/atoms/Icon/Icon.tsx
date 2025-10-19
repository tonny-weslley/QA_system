import { HTMLAttributes } from 'react';
import { cn } from '../../../lib/utils';

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Icon = ({ name, size = 'md', className, ...props }: IconProps) => {
  const sizes = {
    sm: 'text-base',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <span
      className={cn('inline-flex items-center justify-center', sizes[size], className)}
      role="img"
      aria-label={name}
      {...props}
    >
      {name}
    </span>
  );
};
