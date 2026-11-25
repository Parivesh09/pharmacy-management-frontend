import React from 'react';

const IconButton = ({
  icon: Icon,
  onClick,
  variant = 'default',
  size = 'md',
  disabled = false,
  className = '',
  title = '',
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
  
  const variantClasses = {
    default: 'bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md focus:ring-gray-500',
    primary: 'bg-(--primary-color) border border-(--primary-color) hover:bg-(--primary-dark) hover:border-(--primary-dark) hover:shadow-lg focus:ring-(--primary-color) text-white',
    secondary: 'bg-gray-600 border border-gray-600 hover:bg-gray-700 hover:border-gray-700 hover:shadow-lg focus:ring-gray-500 text-white',
    success: 'bg-green-600 border border-green-600 hover:bg-green-700 hover:border-green-700 hover:shadow-lg focus:ring-green-500 text-white',
    danger: 'bg-red-600 border border-red-600 hover:bg-red-700 hover:border-red-700 hover:shadow-lg focus:ring-red-500 text-white',
    warning: 'bg-yellow-600 border border-yellow-600 hover:bg-yellow-700 hover:border-yellow-700 hover:shadow-lg focus:ring-yellow-500 text-white',
    info: 'bg-blue-500 border border-blue-500 hover:bg-blue-600 hover:border-blue-600 hover:shadow-lg focus:ring-blue-500 text-white',
    ghost: 'bg-transparent border border-transparent hover:bg-gray-100 hover:border-gray-200 hover:shadow-sm focus:ring-gray-500',
    outline: 'bg-transparent border border-gray-300 hover:bg-gray-100 hover:border-gray-400 hover:shadow-md focus:ring-gray-500',
  };

  const sizeClasses = {
    xs: 'p-1',
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
    xl: 'p-3',
  };

  const iconSizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  };

  const handleClick = (e) => {
    if (disabled) return;
    if (onClick) {
      onClick(e);
    }
  };

  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      title={title}
      className={combinedClasses}
      {...props}
    >
      {Icon && <Icon className={iconSizeClasses[size]} />}
    </button>
  );
};

export default IconButton; 