import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'orange' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    orange: 'border-orange-500',
    pink: 'border-pink-500',
    gray: 'border-gray-500',
    white: 'border-white'
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} border-2 border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label="Cargando"
      >
        <span className="sr-only">Cargando...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;