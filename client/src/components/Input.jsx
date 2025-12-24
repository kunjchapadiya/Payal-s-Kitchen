import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  icon = null,
  ...props
}, ref) => {
  const baseInputStyles = 'w-full px-4 py-3 font-[Poppins] text-[#2E2E2E] bg-white border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F28C28]/20';
  
  const borderStyles = error 
    ? 'border-red-500 focus:border-red-500' 
    : 'border-[#2E2E2E]/10 focus:border-[#F28C28]';

  const disabledStyles = disabled ? 'bg-gray-100 cursor-not-allowed' : '';

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="font-[Poppins] font-medium text-[#2E2E2E] text-sm">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`${baseInputStyles} ${borderStyles} ${disabledStyles} ${icon ? 'pl-12' : ''}`}
          {...props}
        />
      </div>

      {error && (
        <span className="text-red-500 text-sm font-[Poppins]">{error}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
