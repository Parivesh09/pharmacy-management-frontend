import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import Button from "../../../../components/common/Button";
import { showToast } from "../../../../components/common/Toast";
import {
  useDeleteLedgerMutation,
  useGetLedgersByCompanyIdQuery,
} from "../../../../services/ledgerApi";
import CommonPageLayout from "../../../../components/layout/CommonPageLayout";
import { useSelector } from "react-redux";

const Viewledger = () => {
  const [search, setSearch] = useState("");
  const [selectedSearchField, setSelectedSearchField] = useState("ledgerName");
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(1);
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
      render: (value) => {
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

  useEffect(() => {
    setPage(1);
    setData([]);
    prevDataRef.current = [];
  }, [search]);

  useEffect(() => {
    if (ledgerData?.data && ledgerData.data.length > 0) {
      const uniqueIncomingData = Array.from(
        new Map(ledgerData.data.map(item => [item.id, item])).values()
      );

      if (page === 1) {
        setData(uniqueIncomingData);
        prevDataRef.current = uniqueIncomingData;
      } else {
        const existingIds = new Set(prevDataRef.current.map(item => item.id));
        
        const uniqueNewData = uniqueIncomingData.filter(
          item => !existingIds.has(item.id)
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

  const [deleteLedger] = useDeleteLedgerMutation();

  useEffect(() => {
    if (data && data.length > 0 && !selectedRow) {
      setSelectedRow(data[0]);
    }
  }, [data, selectedRow]);

  const handleAddLedger = () => {
    navigate("/master/account/ledger/add");
  };

  const handleEdit = (row) => {
    navigate(`/master/account/ledger/edit/${row.id}`);
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
      setPage(prev => prev + 1);
    }
  };

  return (
    <CommonPageLayout
      title="Ledger Management"
      actions={[
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
      enableInfiniteScroll={true}
    />
  );
};

export default Viewledger;