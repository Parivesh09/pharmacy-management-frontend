import React, { useState } from 'react';
import { useGetLedgerEntriesByBillQuery, useGetTransactionSummaryForBillQuery } from '../../../../../services/ledgerEntryApi';
import { useLedgerPermissions } from '../../../../../hooks/useLedgerPermissions';
import DataTable from '../../../../../components/common/DataTable';
import Button from '../../../../../components/common/Button';
import Modal from '../../../../../components/common/Modal';
import Loader from '../../../../../components/common/Loader';
import { formatCurrency, formatDate } from '../../../../../utils/formatters';

const LedgerEntriesViewer = ({ 
  billId, 
  billType, 
  billNo, 
  onClose, 
  isVisible = false,
  className = "" 
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const { 
    data: entries = [], 
    isLoading: entriesLoading, 
    error: entriesError 
  } = useGetLedgerEntriesByBillQuery(billId, {
    skip: !billId || !isVisible
  });

  const { 
    data: summary = {}, 
    isLoading: summaryLoading 
  } = useGetTransactionSummaryForBillQuery(billId, {
    skip: !billId || !isVisible
  });

  const firstEntry = entries[0];
  const { canViewTransaction } = useLedgerPermissions(
    firstEntry?.ledger?.acgroup
  );

  const columns = [
    {
      header: 'Date',
      accessorKey: 'date',
      cell: ({ row }) => formatDate(row.original.date)
    },
    {
      header: 'Ledger',
      accessorKey: 'ledger.partyName',
      cell: ({ row }) => row.original.ledger?.partyName || 'N/A'
    },
    {
      header: 'Narration',
      accessorKey: 'narration',
      cell: ({ row }) => (
        <div className="max-w-xs truncate" title={row.original.narration}>
          {row.original.narration}
        </div>
      )
    },
    {
      header: 'Debit',
      accessorKey: 'debit',
      cell: ({ row }) => (
        <span className={row.original.debit > 0 ? 'text-red-600 font-medium' : 'text-gray-400'}>
          {row.original.debit > 0 ? formatCurrency(row.original.debit) : '-'}
        </span>
      )
    },
    {
      header: 'Credit',
      accessorKey: 'credit',
      cell: ({ row }) => (
        <span className={row.original.credit > 0 ? 'text-green-600 font-medium' : 'text-gray-400'}>
          {row.original.credit > 0 ? formatCurrency(row.original.credit) : '-'}
        </span>
      )
    },
    {
      header: 'Balance',
      accessorKey: 'balance',
      cell: ({ row }) => {
        const balance = (row.original.debit || 0) - (row.original.credit || 0);
        return (
          <span className={balance > 0 ? 'text-red-600' : balance < 0 ? 'text-green-600' : 'text-gray-600'}>
            {balance > 0 ? `Dr ${formatCurrency(balance)}` : 
             balance < 0 ? `Cr ${formatCurrency(Math.abs(balance))}` : 
             formatCurrency(0)}
          </span>
        );
      }
    }
  ];

  const handleClose = () => {
    setShowDetails(false);
    onClose?.();
  };

  if (!isVisible) return null;

  if (!canViewTransaction()) {
    return (
      <Modal isOpen={isVisible} onClose={handleClose} size="md">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Ledger Entries - {billType} Bill {billNo}
          </h3>
          <div className="text-center py-8">
            <p className="text-red-600">You don't have permission to view ledger entries for this bill.</p>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleClose}>Close</Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isVisible} onClose={handleClose} size="xl">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            Ledger Entries - {billType} Bill {billNo}
          </h3>
          <Button variant="secondary" size="sm" onClick={handleClose}>
            Close
          </Button>
        </div>

        {entriesLoading || summaryLoading ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : entriesError ? (
          <div className="text-center py-8">
            <p className="text-red-600">Failed to load ledger entries</p>
            <p className="text-sm text-gray-500 mt-2">{entriesError?.data?.message}</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-md font-medium text-gray-900 mb-3">Transaction Summary</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Debit</p>
                  <p className="text-lg font-medium text-red-600">
                    {formatCurrency(summary.totalDebit || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Credit</p>
                  <p className="text-lg font-medium text-green-600">
                    {formatCurrency(summary.totalCredit || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Entries Count</p>
                  <p className="text-lg font-medium text-gray-900">
                    {summary.entryCount || 0}
                  </p>
                </div>
              </div>
            </div>

            
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Ledger Entries</h4>
              {entries.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No ledger entries found for this bill</p>
                </div>
              ) : (
                <DataTable
                  data={entries}
                  columns={columns}
                  className="max-h-96 overflow-y-auto"
                  showPagination={false}
                  showSearch={false}
                />
              )}
            </div>

            
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-md font-medium text-gray-900 mb-3">Bill Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Bill Type</p>
                  <p className="font-medium">{billType}</p>
                </div>
                <div>
                  <p className="text-gray-600">Bill Number</p>
                  <p className="font-medium">{billNo}</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Amount</p>
                  <p className="font-medium">{formatCurrency(summary.totalDebit || summary.totalCredit || 0)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Entries Created</p>
                  <p className="font-medium">{summary.entryCount || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default LedgerEntriesViewer; 