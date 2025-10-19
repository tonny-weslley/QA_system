import { forwardRef } from 'react';
import { Input } from '../../atoms/Input';
import type { InputProps } from '../../atoms/Input';
import { cn } from '../../../lib/utils';

export interface FormFieldProps extends InputProps {
  label: string;
  error?: string;
  helperText?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="space-y-2">
        <label htmlFor={inputId} className="text-sm font-medium text-gray-200">
          {label}
          {props.required && <span className="text-error ml-1" aria-label="required">*</span>}
        </label>
        <Input 
          ref={ref} 
          id={inputId}
          error={error} 
          className={className}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          {...props} 
        />
        {error && (
          <p id={errorId} className="text-sm text-error" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
