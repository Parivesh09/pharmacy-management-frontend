import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Button from "../../../../components/common/Button";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../../components/common/Toast";
import { 
  useGetTransactionsQuery, 
  useDeleteTransactionMutation, 
  usePostTransactionMutation 
} from "../../../../services/transactionApi";
import CommonPageLayout from "../../../../components/layout/CommonPageLayout";

const TransactionList = () => {
  const [search, setSearch] = useState("");
  const [selectedSearchField, setSelectedSearchField] = useState("voucherNumber");
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    voucherType: "",
    status: "",
    isPosted: ""
  });
  const navigate = useNavigate();

  const searchOptions = [
    { value: "voucherNumber", label: "Voucher Number" },
    { value: "description", label: "Description" },
    { value: "referenceNumber", label: "Reference" },
  ];

  const voucherTypeOptions = [
    { value: "", label: "All Types" },
    { value: "Receipt", label: "Receipt" },
    { value: "Payment", label: "Payment" },
    { value: "Journal", label: "Journal" },
    { value: "Contra", label: "Contra" },
    { value: "DebitNote", label: "Debit Note" },
    { value: "CreditNote", label: "Credit Note" },
  ];

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "Draft", label: "Draft" },
    { value: "Posted", label: "Posted" },
    { value: "Cancelled", label: "Cancelled" },
  ];

  const columns = [
    { 
      key: "voucherNumber", 
      title: "Voucher Number",
      render: (value, row) => (
        <div className="font-medium text-gray-900">{value}</div>
      )
    },
    { 
      key: "voucherDate", 
      title: "Date",
      render: (value) => {
        if (!value) return "-";
        return new Date(value).toLocaleDateString('en-IN');
      }
    },
    { 
      key: "voucherType", 
      title: "Type",
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Receipt' ? 'bg-green-100 text-green-800' :
          value === 'Payment' ? 'bg-red-100 text-red-800' :
          value === 'Journal' ? 'bg-blue-100 text-blue-800' :
          value === 'Contra' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
    { 
      key: "amount", 
      title: "Amount",
      render: (value) => {
        const formattedAmount = new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 2
        }).format(value || 0);
        return (
          <div className="font-medium text-gray-900">{formattedAmount}</div>
        );
      }
    },
    { 
      key: "debitLedger", 
      title: "Debit Ledger",
      render: (value, row) => row.debitLedger?.ledgerName || "-"
    },
    { 
      key: "creditLedger", 
      title: "Credit Ledger",
      render: (value, row) => row.creditLedger?.ledgerName || "-"
    },
    { 
      key: "status", 
      title: "Status",
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Posted' ? 'bg-green-100 text-green-800' :
          value === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
          value === 'Cancelled' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
  ];


  const { data, isLoading, error, refetch } = useGetTransactionsQuery({
    search,
    page,
    limit: 10,
    ...filters
  });

  const [deleteTransaction] = useDeleteTransactionMutation();
  const [postTransaction] = usePostTransactionMutation();


  useEffect(() => {
    if (data?.data && data.data.length > 0 && !selectedRow) {
      setSelectedRow(data.data[0]);
    }
  }, [data, selectedRow]);

  const handleAddTransaction = () => {
    navigate("/master/account/transaction/create");
  };

  const handleEdit = (row) => {
    navigate(`/master/account/transaction/edit/${row.id}`);
  };

  const handleView = (row) => {
    navigate(`/master/account/transaction/view/${row.id}`);
  };

  const handleDelete = async (row) => {
    if (window.confirm(`Are you sure you want to delete transaction "${row.voucherNumber}"?`)) {
      try {
        await deleteTransaction(row.id).unwrap();
        showToast("Transaction deleted successfully", "success");
        refetch();
      } catch (error) {
        showToast(error?.data?.message || "Failed to delete transaction", "error");
      }
    }
  };

  const handlePostTransaction = async (row) => {
    if (row.status === 'Posted') {
      showToast("Transaction is already posted", "warning");
      return;
    }
    
    try {
      await postTransaction(row.id).unwrap();
      showToast("Transaction posted successfully", "success");
      refetch();
    } catch (error) {
      showToast(error?.data?.message || "Failed to post transaction", "error");
    }
  };

  const handleRowSelect = (row) => {
    setSelectedRow(row);
  };

  const handleKeyDown = (e) => {
    if (!data?.data || data.data.length === 0) return;
    if (!selectedRow) return;
    const idx = data.data.findIndex((t) => t.id === selectedRow.id);
    if (e.key === "ArrowDown") {
      const nextIdx = idx < data.data.length - 1 ? idx + 1 : 0;
      setSelectedRow(data.data[nextIdx]);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      const prevIdx = idx > 0 ? idx - 1 : data.data.length - 1;
      setSelectedRow(data.data[prevIdx]);
      e.preventDefault();
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  return (
    <CommonPageLayout
      title="Transaction Management"
      subtitle="Manage your Transactions"
      actions={[
        <Button key="add" onClick={handleAddTransaction}>
          <Plus className="w-4 h-4 mr-2" /> Create Transaction
        </Button>,
      ]}
      search={search}
      onSearchChange={e => {
        setSearch(e.target.value);
        setPage(1);
      }}
      extraFilters={
        <div className="flex flex-wrap gap-2">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={filters.voucherType}
            onChange={(e) => handleFilterChange('voucherType', e.target.value)}
          >
            {voucherTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      }
      tableData={data?.data || []}
      columns={columns}
      isLoading={isLoading}
      selectedRow={selectedRow}
      onRowSelect={handleRowSelect}
      onAdd={handleAddTransaction}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={(row) => handleDelete(row)}
      onArrowNavigation={handleKeyDown}
      page={page}
      totalPages={data?.totalPages || 1}
      onPageChange={setPage}
      rowInfoPanel={
        selectedRow && (
          <div className="flex flex-col gap-1 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <div className="border border-gray-300 rounded-lg p-1 bg-gray-50">
                <div className="font-semibold mb-0.5">Voucher Number</div>
                <div>{selectedRow.voucherNumber || "-"}</div>
                <div className="font-semibold mb-0.5 mt-1">Date</div>
                <div>{selectedRow.voucherDate ? new Date(selectedRow.voucherDate).toLocaleDateString('en-IN') : '-'}</div>
                <div className="font-semibold mb-0.5 mt-1">Type</div>
                <div>{selectedRow.voucherType || "-"}</div>
              </div>
              <div className="border border-gray-300 rounded-lg p-1 bg-gray-50">
                <div className="font-semibold mb-0.5">Amount</div>
                <div>₹{new Intl.NumberFormat('en-IN').format(selectedRow.amount || 0)}</div>
                <div className="font-semibold mb-0.5 mt-1">Status</div>
                <div>{selectedRow.status || "-"}</div>
                <div className="font-semibold mb-0.5 mt-1">Posted</div>
                <div>{selectedRow.isPosted ? 'Yes' : 'No'}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1 bg-gray-100 rounded p-1 mt-1 text-xs">
              <div><b>Debit Ledger:</b> {selectedRow.debitLedger?.ledgerName || "-"}</div>
              <div><b>Credit Ledger:</b> {selectedRow.creditLedger?.ledgerName || "-"}</div>
            </div>
            {selectedRow.status === 'Draft' && (
              <div className="mt-1">
                <Button
                  onClick={() => handlePostTransaction(selectedRow)}
                  className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
                >
                  Post Transaction
                </Button>
              </div>
            )}
          </div>
        )
      }
    />
  );
};

export default TransactionList; 