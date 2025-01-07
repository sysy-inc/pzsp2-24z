import React from 'react';

interface InputProps {
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const Input: React.FC<InputProps> = ({ type, placeholder, value, onChange, className }) => {
  const baseStyles = 'border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300';
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`${baseStyles} ${className || ''}`}
    />
  );
};

export default Input;
