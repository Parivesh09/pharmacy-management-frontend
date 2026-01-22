import { useState, useEffect, useRef } from "react";
import Modal from "./Modal.jsx";
import DataTable from "./DataTable.jsx";
import StatusBadge from "./StatusBadge.jsx";
import { useGetLedgersQuery } from "../../services/ledgerApi.js";
import { useDebounce } from "../../utils/useDebounce.js";
import Input from "./Input.jsx";
import Select from "./Select.jsx";

const GlobalLedgerListModal = ({ 
    open, 
    onClose, 
    onSelectLedger, 
    title = "Select Ledger",
    groupIds,
    defaultFilters = {} 
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const debouncedSearch = useDebounce(search, 300);
  const prevDataRef = useRef([]);

  const { 
    data: ledgerData, 
    isLoading, 
    isFetching 
  } = useGetLedgersQuery({
    page,
    limit: 10,
    search: debouncedSearch,
    groupIds: groupIds,
    isActive: true,
    ...defaultFilters
  });

  useEffect(() => {
    setPage(1);
    setData([]);
    prevDataRef.current = [];
  }, [debouncedSearch, groupIds]); // Reset when search or groupIds change

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

  const columns = [
    { key: "name", title: "Ledger Name" },
    { key: "station", title: "Station"},
    { 
        key: "closingBalance", 
        title: "Balance", 
        render: (val, row) => `${parseFloat(val || 0).toFixed(2)} ${row.balanceType}` 
    },
    {
      key: "status",
      title: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  const pagination = ledgerData?.pagination;
  const hasMore = pagination ? page < pagination.totalPages : false;

  const loadMore = () => {
    if (pagination && page < pagination.totalPages && !isFetching) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="max-w-full md:max-w-[50vw]"
      title={title}
    >
      <div className="mb-2 flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center flex-1">
          <Input
            fullWidth={true}
            placeholder="Search ledger..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <DataTable
        title="Ledger"
        columns={columns}
        data={data || []}
        onRowSelect={(row) => {
          onSelectLedger(row);
          onClose(); // Close on select
        }}
        isLoading={isLoading}
        onLoadMore={loadMore}
        hasMore={hasMore}
        loading={isFetching}
        enableInfiniteScroll={true}
        fullHeight={true}
        selectedRow={null}
      />
    </Modal>
  );
};

export default GlobalLedgerListModal;
