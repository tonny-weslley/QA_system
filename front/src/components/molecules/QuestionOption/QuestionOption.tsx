import { HTMLAttributes } from 'react';
import { cn } from '../../../lib/utils';

export interface QuestionOptionProps extends HTMLAttributes<HTMLButtonElement> {
  text: string;
  isSelected?: boolean;
  isCorrect?: boolean;
  isRevealed?: boolean;
  disabled?: boolean;
}

export const QuestionOption = ({
  text,
  isSelected = false,
  isCorrect = false,
  isRevealed = false,
  disabled = false,
  className,
  ...props
}: QuestionOptionProps) => {
  const getStyles = () => {
    if (isRevealed) {
      if (isCorrect) {
        return 'border-success bg-success/10 text-success';
      }
      if (isSelected && !isCorrect) {
        return 'border-error bg-error/10 text-error';
      }
    }
    
    if (isSelected) {
      return 'border-halloween-purple bg-halloween-purple/10 text-white';
    }
    
    return 'border-gray-700 hover:border-gray-600 text-white';
  };

  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        'w-full p-4 rounded-lg border-2 text-left transition-all',
        'focus:outline-none focus:ring-2 focus:ring-halloween-purple focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        getStyles(),
        className
      )}
      aria-pressed={isSelected}
      aria-disabled={disabled}
      {...props}
    >
      <span className="flex items-center gap-3">
        <span
          className={cn(
            'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
            isSelected && 'border-halloween-purple bg-halloween-purple',
            isRevealed && isCorrect && 'border-success bg-success',
            isRevealed && isSelected && !isCorrect && 'border-error bg-error'
          )}
        >
          {isSelected && (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </span>
        <span className="flex-1">{text}</span>
        {isRevealed && isCorrect && <span className="text-success">✓</span>}
        {isRevealed && isSelected && !isCorrect && <span className="text-error">✗</span>}
      </span>
    </button>
  );
};
