import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, type = 'button', variant = 'primary', className }) => {
  const baseStyles = 'px-4 py-2 rounded font-semibold focus:outline-none focus:ring';
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300',
    secondary: 'bg-gray-300 text-black hover:bg-gray-400 focus:ring-gray-200',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className || ''}`}
    >
      {children}
    </button>
  );
};

export default Button;
