import { ShieldCheckIcon } from 'lucide-react';
import React from 'react';

const DefaultLedgerIndicator = ({ ledger, className = "" }) => {
  if (!ledger?.isDefault) return null;

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full ${className}`}>
      <ShieldCheckIcon className="w-3 h-3" />
      <span>Default</span>
    </div>
  );
};

export default DefaultLedgerIndicator; 