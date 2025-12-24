import React from 'react';

const Card = ({ 
  children, 
  className = '',
  hover = true,
  padding = 'md',
  onClick,
}) => {
  const baseStyles = 'bg-white rounded-3xl border border-[#F28C28]/10 transition-all duration-300';
  
  const hoverStyles = hover 
    ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' 
    : 'shadow-sm';

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div 
      className={`${baseStyles} ${hoverStyles} ${paddingStyles[padding]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
