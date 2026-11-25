import React, { useState } from 'react';
import { useGetLedgersQuery, useDeleteLedgerMutation } from '../../../../../services/ledgerApi';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../../../components/common/DataTable';
import Button from '../../../../../components/common/Button';
import DefaultLedgerIndicator from '../../../../../components/common/DefaultLedgerIndicator';
import { useDefaultLedgerPermissions } from '../../../../../hooks/useDefaultLedgerPermissions';
import { showToast } from '../../../../../components/common/Toast';
import { formatCurrency } from '../../../../../utils/formatters';

const LedgerListWithDefaults = () => {
  const navigate = useNavigate();
  const [selectedLedger, setSelectedLedger] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: ledgers = [], isLoading, refetch } = useGetLedgersQuery({
    page: 1,
    limit: 1000,
  });

  const [deleteLedger, { isLoading: deleteLoading }] = useDeleteLedgerMutation();

  const handleEdit = (ledger) => {
    navigate(`/master/account/ledger/edit/${ledger.id}`);
  };

  const handleView = (ledger) => {
    navigate(`/master/account/ledger/view/${ledger.id}`);
  };

  const handleDelete = (ledger) => {
    setSelectedLedger(ledger);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteLedger(selectedLedger.id).unwrap();
      showToast('Ledger deleted successfully', 'success');
      setShowDeleteModal(false);
      setSelectedLedger(null);
      refetch();
    } catch (error) {
      showToast(error?.data?.message || 'Failed to delete ledger', 'error');
    }
  };

  const columns = [
    {
      header: 'Ledger Name',
      accessorKey: 'ledgerName',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.original.ledgerName}</span>
          {row.original.isDefault && (
            <DefaultLedgerIndicator ledger={row.original} />
          )}
        </div>
      ),
    },
    {
      header: 'Group',
      accessorKey: 'group.groupName',
    },
    {
      header: 'Opening Balance',
      accessorKey: 'openingBalance',
      cell: ({ row }) => (
        <span className={`font-medium ${
          row.original.balanceType === 'Credit' ? 'text-green-600' : 'text-red-600'
        }`}>
          {formatCurrency(row.original.openingBalance || 0)} {row.original.balanceType}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          row.original.status === 'Active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {row.original.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }) => {
        const ledger = row.original;
        const permissions = useDefaultLedgerPermissions(ledger);

        return (
          <div className="flex gap-2">
            {permissions.canView && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleView(ledger)}
              >
                View
              </Button>
            )}
            
            {permissions.canEdit && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => handleEdit(ledger)}
              >
                Edit
              </Button>
            )}
            
            {permissions.canDelete && (
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => handleDelete(ledger)}
                disabled={ledger.isDefault && !ledger.canDelete}
              >
                Delete
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Ledger List</h2>
        <Button
          type="button"
          variant="primary"
          onClick={() => navigate('/master/account/ledger/create')}
        >
          Create New Ledger
        </Button>
      </div>

      <DataTable
        data={ledgers}
        columns={columns}
        isLoading={isLoading}
        searchable
        pagination
        pageSize={10}
      />

      
      {showDeleteModal && selectedLedger && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the ledger "{selectedLedger.ledgerName}"?
              {selectedLedger.isDefault && (
                <span className="block mt-2 text-amber-600 font-medium">
                  This is a default ledger and may be protected from deletion.
                </span>
              )}
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={confirmDelete}
                loading={deleteLoading}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LedgerListWithDefaults; 