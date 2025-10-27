'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  id?: string;
  name?: string;
}

export function Switch({
  checked = false,
  onChange,
  disabled = false,
  size = 'md',
  className,
  id,
  name,
  ...props
}: SwitchProps) {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    if (disabled) return;
    
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onChange?.(newChecked);
  };

  const sizeClasses = {
    sm: 'h-4 w-7',
    md: 'h-5 w-9',
    lg: 'h-6 w-11'
  };

  const thumbSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const translateClasses = {
    sm: isChecked ? 'translate-x-3' : 'translate-x-0',
    md: isChecked ? 'translate-x-4' : 'translate-x-0',
    lg: isChecked ? 'translate-x-5' : 'translate-x-0'
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      onClick={handleToggle}
      disabled={disabled}
      className={cn(
        'relative inline-flex items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        sizeClasses[size],
        isChecked ? 'bg-primary' : 'bg-gray-200',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      id={id}
      name={name}
      {...props}
    >
      <span
        className={cn(
          'pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition-transform',
          thumbSizeClasses[size],
          translateClasses[size]
        )}
      />
    </button>
  );
}
