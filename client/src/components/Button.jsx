import React from 'react';

const base = "inline-flex items-center justify-center rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
  secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 focus:ring-gray-300",
  outline: "bg-transparent text-gray-900 border border-gray-300 hover:bg-gray-50 focus:ring-gray-300",
  glass: "bg-white/10 text-white border border-white/20 backdrop-blur-md hover:bg-white/20 focus:ring-white/40",
  ghost: "bg-transparent text-white/90 hover:bg-white/10 focus:ring-white/30",
  subtle: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-300"
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base"
};

function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  leftIcon = null,
  rightIcon = null,
  ...props
}) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
}

export default Button;
