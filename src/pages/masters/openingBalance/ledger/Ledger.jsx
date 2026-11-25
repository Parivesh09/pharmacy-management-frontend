import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Upload } from "lucide-react";
import Button from "../../../../components/common/Button";
import { showToast } from "../../../../components/common/Toast";
import {
  useDeleteLedgerMutation,
  useGetLedgersByCompanyIdQuery,
  useUpdateLedgerMutation,
} from "../../../../services/ledgerApi";
import CommonPageLayout from "../../../../components/layout/CommonPageLayout";
import { useSelector } from "react-redux";
import Modal from "../../../../components/common/Modal";
import Input from "../../../../components/common/Input";

const OpeningBalanceLedger = () => {
  const [search, setSearch] = useState("");
  const [selectedSearchField, setSelectedSearchField] = useState("ledgerName");
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [showBulkModal, setShowBulkModal] = useState(false);
  const limit = 10;
  const navigate = useNavigate();
  const { currentCompany } = useSelector((state) => state.user);
  const [data, setData] = useState([]);
  const prevDataRef = useRef([]);

  const searchOptions = [
    { value: "ledgerName", label: "Ledger Name" },
    { value: "groupName", label: "Group Name" },
    { value: "balanceType", label: "Balance Type" },
  ];

  const columns = [
    {
      key: "ledgerName",
      title: "Ledger Name",
      render: (value, row) => (
        <div className="font-medium text-gray-900">{value}</div>
      ),
    },
    {
      key: "groupName",
      title: "Group",
      render: (value, row) => row.accountGroup?.groupName || "-",
    },
    {
      key: "balanceType",
      title: "Balance Type",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === "Debit"
              ? "bg-blue-100 text-blue-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "openingBalance",
      title: "Opening Balance",
      render: (value, row) => {
        if (editingId === row.id) {
          return (
            <input
              type="number"
              step="0.01"
              value={editValues.openingBalance || 0}
              onChange={(e) =>
                setEditValues({
                  ...editValues,
                  openingBalance: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-2 py-1 border border-gray-300 rounded"
            />
          );
        }
        const formattedAmount = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          minimumFractionDigits: 2,
        }).format(value || 0);
        return (
          <div className="font-medium text-gray-900">{formattedAmount}</div>
        );
      },
    },
    {
      key: "isActive",
      title: "Status",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  const {
    data: ledgerData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetLedgersByCompanyIdQuery(
    {
      companyId: currentCompany?.id,
      search,
      page,
      limit: limit,
    },
    { skip: !currentCompany?.id }
  );

  const [updateLedger] = useUpdateLedgerMutation();
  const [deleteLedger] = useDeleteLedgerMutation();

  useEffect(() => {
    setPage(1);
    setData([]);
    prevDataRef.current = [];
  }, [search]);

  useEffect(() => {
    if (ledgerData?.data && ledgerData.data.length > 0) {
      const uniqueIncomingData = Array.from(
        new Map(ledgerData.data.map((item) => [item.id, item])).values()
      );

      if (page === 1) {
        setData(uniqueIncomingData);
        prevDataRef.current = uniqueIncomingData;
      } else {
        const existingIds = new Set(prevDataRef.current.map((item) => item.id));

        const uniqueNewData = uniqueIncomingData.filter(
          (item) => !existingIds.has(item.id)
        );

        if (uniqueNewData.length > 0) {
          const updatedData = [...prevDataRef.current, ...uniqueNewData];
          setData(updatedData);
          prevDataRef.current = updatedData;
        }
      }
    }
  }, [ledgerData, page]);

  const pagination = ledgerData?.pagination;
  const hasMore = pagination ? page < pagination.totalPages : false;

  useEffect(() => {
    if (data && data.length > 0 && !selectedRow) {
      setSelectedRow(data[0]);
    }
  }, [data, selectedRow]);

  const handleAddLedger = () => {
    navigate("/master/account/ledger/create");
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setEditValues({
      openingBalance: row.openingBalance || 0,
    });
  };

  const handleSaveEdit = async (row) => {
    try {
      await updateLedger({
        id: row.id,
        ...editValues,
      }).unwrap();
      showToast("Opening balance updated successfully", "success");
      setEditingId(null);
      refetch();
    } catch (error) {
      showToast(
        error?.data?.message || "Failed to update opening balance",
        "error"
      );
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleDelete = async (row) => {
    if (
      window.confirm(
        `Are you sure you want to delete ledger "${row.ledgerName}"?`
      )
    ) {
      try {
        await deleteLedger(row.id).unwrap();
        showToast("Ledger deleted successfully", "success");
        refetch();
      } catch (error) {
        showToast(error?.data?.message || "Failed to delete ledger", "error");
      }
    }
  };

  const handleViewDetails = (row) => {
    navigate(`/master/account/ledger/details/${row.id}`);
  };

  const handleRowSelect = (row) => {
    setSelectedRow(row);
  };

  const handleKeyDown = (e) => {
    if (!data || data.length === 0) return;
    if (!selectedRow) return;
    const idx = data.findIndex((l) => l.id === selectedRow.id);
    if (e.key === "ArrowDown") {
      const nextIdx = idx < data.length - 1 ? idx + 1 : 0;
      setSelectedRow(data[nextIdx]);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      const prevIdx = idx > 0 ? idx - 1 : data.length - 1;
      setSelectedRow(data[prevIdx]);
      e.preventDefault();
    }
  };

  const loadMore = () => {
    if (pagination && page < pagination.totalPages && !isFetching) {
      setPage((prev) => prev + 1);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Ledger Name",
      "Group",
      "Balance Type",
      "Opening Balance",
      "Status",
    ];
    const rows = data.map((row) => [
      row.ledgerName,
      row.accountGroup?.groupName || "-",
      row.balanceType,
      row.openingBalance || 0,
      row.isActive ? "Active" : "Inactive",
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `opening-balance-ledger-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast("Ledger data exported successfully", "success");
  };

  // Show message if no company is selected
  if (!currentCompany?.id) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-gray-600">Please select a company first</p>
      </div>
    );
  }

  return (
    <CommonPageLayout
      title="Opening Balance - Ledger"
      subtitle="Manage opening balances for all ledgers"
      actions={[
        <Button
          key="export"
          variant="secondary"
          onClick={handleExportCSV}
          disabled={data.length === 0}
        >
          <Download className="w-4 h-4 mr-2" /> Export
        </Button>,
        <Button key="add" onClick={handleAddLedger}>
          <Plus className="w-4 h-4 mr-2" /> Create Ledger
        </Button>,
      ]}
      justifyBetween={true}
      search={search}
      onSearchChange={(e) => {
        setSearch(e.target.value);
      }}
      hasMore={hasMore}
      onLoadMore={loadMore}
      tableData={data || []}
      columns={columns}
      isLoading={isLoading}
      isFetching={isFetching}
      selectedRow={selectedRow}
      onRowSelect={handleRowSelect}
      onAdd={handleAddLedger}
      onEdit={handleEdit}
      onDelete={(row) => handleDelete(row)}
      onArrowNavigation={handleKeyDown}
      renderRowActions={(row) => (
        <div className="flex gap-2">
          {editingId === row.id ? (
            <>
              <button
                onClick={() => handleSaveEdit(row)}
                className="px-2 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-2 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleEdit(row)}
                className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(row)}
                className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Delete
              </button>
            </>
          )}
        </div>
      )}
    />
  );
};

export default OpeningBalanceLedger;
