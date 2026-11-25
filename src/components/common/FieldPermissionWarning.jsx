import React from 'react';


const FieldPermissionWarning = ({ 
  isVisible = false, 
  message = "This field cannot be modified for default ledgers",
  className = "" 
}) => {
  if (!isVisible) return null;

  return (
    <div className={`flex items-center gap-2 p-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md ${className}`}>
      <ExclamationTriangleIcon className="w-4 h-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

export default FieldPermissionWarning; 