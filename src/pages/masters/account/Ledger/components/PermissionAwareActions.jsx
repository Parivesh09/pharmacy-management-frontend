import React from 'react';
import Button from '../../../../../components/common/Button';
import { useLedgerPermissions } from '../../../../../hooks/useLedgerPermissions';

const PermissionAwareActions = ({ 
  ledger, 
  onEdit, 
  onDelete, 
  onView, 
  onViewTransactions,
  onViewBalance,
  className = "" 
}) => {
  const { 
    canEdit, 
    canDelete, 
    canView, 
    showEditButton, 
    showDeleteButton,
    groupName 
  } = useLedgerPermissions(ledger?.acgroup);

  return (
    <div className={`flex gap-2 ${className}`}>
      
      {canView() && onView && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => onView(ledger)}
          title="View Ledger Details"
        >
          View
        </Button>
      )}

      
      {canView() && onViewTransactions && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => onViewTransactions(ledger)}
          title="View Transactions"
        >
          Transactions
        </Button>
      )}

      
      {canView() && onViewBalance && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => onViewBalance(ledger)}
          title="View Balance"
        >
          Balance
        </Button>
      )}

      
      {showEditButton() && onEdit && (
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => onEdit(ledger)}
          title="Edit Ledger"
        >
          Edit
        </Button>
      )}

      
      {showDeleteButton() && onDelete && (
        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={() => onDelete(ledger)}
          title="Delete Ledger"
          disabled={

            groupName.toLowerCase().includes('cash-in-hand') ||
            groupName.toLowerCase().includes('capital') ||
            groupName.toLowerCase().includes('sales') ||
            groupName.toLowerCase().includes('purchase') ||
            groupName.toLowerCase().includes('bank')
          }
        >
          Delete
        </Button>
      )}

      
      {!canEdit() && !canDelete() && (
        <div className="text-xs text-gray-500 mt-1">
          Read-only access for {groupName}
        </div>
      )}
    </div>
  );
};

export default PermissionAwareActions; 