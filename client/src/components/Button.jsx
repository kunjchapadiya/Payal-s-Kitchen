import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  type = 'button',
  disabled = false,
  className = '',
  icon = null,
  fullWidth = false,
}) => {
  const baseStyles = 'font-[Poppins] font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-[#F28C28] text-white hover:bg-[#d9741e] hover:-translate-y-0.5 shadow-lg shadow-[#F28C28]/30 disabled:bg-gray-300 disabled:shadow-none disabled:translate-y-0',
    secondary: 'bg-white text-[#2E2E2E] border-2 border-[#2E2E2E]/10 hover:border-[#F28C28] hover:text-[#F28C28] hover:-translate-y-0.5 disabled:bg-gray-100 disabled:border-gray-200',
    outline: 'bg-transparent border-2 border-[#F28C28] text-[#F28C28] hover:bg-[#F28C28] hover:text-white disabled:border-gray-300 disabled:text-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 hover:-translate-y-0.5 shadow-lg shadow-red-500/30 disabled:bg-gray-300',
    ghost: 'bg-transparent text-[#2E2E2E] hover:bg-[#FFF8E7] disabled:text-gray-300',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
