import React from 'react';

const Logo = ({ className = "w-8 h-8", textClassName = "font-bold text-sm", bgClass = "bg-white", textColor = "text-(--header-bg)" }) => {
  return (
    <div className={`${bgClass} rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${className}`}>
      <span className={`${textColor} ${textClassName}`}>ASR</span>
    </div>
  );
};

export default Logo;
