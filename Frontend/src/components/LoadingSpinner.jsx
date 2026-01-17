import React from 'react';

const LoadingSpinner = ({
  size = 'md',
  color = 'primary',
  className = '',
  text,
  ...props
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const colorClasses = {
    primary: 'border-blue-600',
    secondary: 'border-gray-600',
    success: 'border-green-600',
    danger: 'border-red-600'
  };

  const spinnerClasses = [
    'animate-spin rounded-full border-b-2',
    sizeClasses[size],
    colorClasses[color],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="flex flex-col items-center justify-center" {...props}>
      <div className={spinnerClasses}></div>
      {text && <span className="mt-4 text-gray-600 text-sm">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;