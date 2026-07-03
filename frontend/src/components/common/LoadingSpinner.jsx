import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'primary' }) => {
  const sizeMap = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };
  const colorMap = { primary: 'border-primary-200 border-t-primary-600', white: 'border-white/30 border-t-white' };
  return <div className={`${sizeMap[size]} ${colorMap[color]} rounded-full border-4 animate-spin`} />;
};

export default LoadingSpinner;