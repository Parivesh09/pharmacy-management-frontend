import React from 'react';
import Modal from '../../../../../components/common/Modal';
import Button from '../../../../../components/common/Button';
import { AlertTriangle, Trash2 } from 'lucide-react';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  group, 
  isDeleting 
}) => {
  if (!group) return null;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Delete Group"
      className="max-w-md"
    >
      <div className="space-y-4">
        
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Delete Group
          </h3>
          <p className="text-gray-600">
            Are you sure you want to delete the group{' '}
            <span className="font-semibold text-gray-900">"{group.groupName}"</span>?
          </p>
          
          
          {group.children && group.children.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> This group has {group.children.length} sub-group(s). 
                Deleting this group will also delete all its sub-groups and their associated ledgers.
              </p>
            </div>
          )}

          
          {group.ledgerCount > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Critical:</strong> This group has {group.ledgerCount} ledger(s). 
                Deleting this group will permanently remove all associated ledgers and their transaction history.
              </p>
            </div>
          )}
        </div>

        
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700"
            startIcon={<Trash2 className="w-4 h-4" />}
          >
            {isDeleting ? 'Deleting...' : 'Delete Group'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal; 