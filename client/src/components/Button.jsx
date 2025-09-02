import React from 'react';

const base = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none cursor-pointer";

const variants = {
  // Bright neon gradient for dark backgrounds
  primaryGlow: "bg-gradient-to-br from-sky-500/90 to-indigo-600/90 text-white/95 shadow-glow hover:from-sky-400 hover:to-indigo-500 focus:ring-2 focus:ring-sky-400/40",
  // Classic primary
  primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/60",
  // White pill for contrast on dark bg
  secondary: "bg-white/90 text-gray-900 hover:bg-white focus:ring-2 focus:ring-white/30",
  // Subtle outline adapted for darker bg
  outline: "bg-transparent text-white/90 hover:bg-white/10 focus:ring-2 focus:ring-white/20",
  // Glass buttons for hero areas
  glassDark: "bg-white/10 text-white backdrop-blur-md hover:bg-white/14 focus:ring-2 focus:ring-white/20",
  glassLight: "bg-white/80 text-gray-900 backdrop-blur-lg hover:bg-white focus:ring-2 focus:ring-gray-300",
  glass: "bg-white/10 text-white backdrop-blur-md hover:bg-white/16 focus:ring-2 focus:ring-white/30",
  // Low-emphasis
  ghost: "bg-transparent text-white/90 hover:bg-white/10 focus:ring-2 focus:ring-white/20",
  subtle: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-2 focus:ring-gray-300",
  danger: "bg-rose-600 text-white hover:bg-rose-700 focus:ring-2 focus:ring-rose-400/60",
  success: "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-400/60",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
  xl: "px-6 py-3 text-base",
  icon: "p-2"
};

function Spinner() {
  return (
    <svg className="animate-spin -ml-0.5 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
  );
}

function Button({
  children,
  variant = 'glassDark',
  size = 'md',
  className = '',
  leftIcon = null,
  rightIcon = null,
  loading = false,
  ...props
}) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Spinner />}
      {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
}

export default Button;
