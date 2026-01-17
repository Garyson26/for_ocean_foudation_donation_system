import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  success,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  size = 'md',
  variant = 'outlined',
  disabled = false,
  className = '',
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg'
  };

  const baseClasses = 'border rounded-lg focus:ring-2 focus:border-transparent transition-colors duration-200';
  const variantClasses = variant === 'outlined' ? 'bg-white' : 'bg-gray-50';
  const stateClasses = error
    ? 'border-red-300 focus:ring-red-500'
    : success
    ? 'border-green-300 focus:ring-green-500'
    : 'border-gray-300 focus:ring-blue-500';
  const disabledClasses = disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : '';
  const widthClass = fullWidth ? 'w-full' : '';
  const iconPadding = leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : '';

  const inputClasses = [
    baseClasses,
    variantClasses,
    sizeClasses[size],
    stateClasses,
    disabledClasses,
    widthClass,
    iconPadding,
    className
  ].filter(Boolean).join(' ');

  const containerClasses = fullWidth ? 'w-full' : '';

  return (
    <div className={containerClasses}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          className={inputClasses}
          disabled={disabled}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>

      {(error || success || helperText) && (
        <div className="mt-1 text-sm">
          {error && <span className="text-red-600">{error}</span>}
          {success && <span className="text-green-600">{success}</span>}
          {helperText && !error && !success && (
            <span className="text-gray-500">{helperText}</span>
          )}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;