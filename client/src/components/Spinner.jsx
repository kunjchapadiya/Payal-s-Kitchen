import React from 'react';

const Spinner = ({ size = 'md', color = 'orange', className = '' }) => {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  const colors = {
    orange: 'border-[#F28C28] border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-300 border-t-transparent',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`${sizes[size]} ${colors[color]} rounded-full animate-spin`}
      />
    </div>
  );
};

export default Spinner;
