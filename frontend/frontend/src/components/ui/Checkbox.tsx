'use client';

import { forwardRef } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'error';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, variant = 'default', size = 'md', label, description, ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5'
    };

    const iconSizeClasses = {
      sm: 'h-2 w-2',
      md: 'h-3 w-3',
      lg: 'h-4 w-4'
    };

    const checkbox = (
      <div className="relative">
        <input
          type="checkbox"
          className={cn(
            'peer sr-only',
            className
          )}
          ref={ref}
          {...props}
        />
        <div
          className={cn(
            'flex items-center justify-center rounded border-2 border-gray-300 bg-white transition-colors',
            'peer-checked:border-primary peer-checked:bg-primary',
            'peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2',
            'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
            variant === 'error' && 'border-red-500 peer-checked:border-red-500 peer-checked:bg-red-500',
            sizeClasses[size]
          )}
        >
          <Check 
            className={cn(
              'text-white opacity-0 transition-opacity',
              'peer-checked:opacity-100',
              iconSizeClasses[size]
            )}
          />
        </div>
      </div>
    );

    if (label || description) {
      return (
        <div className="flex items-start space-x-3">
          {checkbox}
          <div className="flex-1 min-w-0">
            {label && (
              <label 
                className={cn(
                  'text-sm font-medium text-gray-900 cursor-pointer',
                  props.disabled && 'opacity-50 cursor-not-allowed'
                )}
                onClick={() => !props.disabled && props.onChange?.({ target: { checked: !props.checked } } as any)}
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
        </div>
      );
    }

    return checkbox;
  }
);

Checkbox.displayName = 'Checkbox';
