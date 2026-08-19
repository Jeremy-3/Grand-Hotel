import React from 'react';

const LoadingSpinner = ({ text = 'Loading luxury experience...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div
        className={`${sizeClasses[size]} border-gold-500/20 border-t-gold-500 rounded-full animate-spin`}
      />
      {text && <p className="text-sm font-medium text-gray-400 tracking-wide">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
