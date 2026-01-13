import { useState, useEffect, useRef } from "react";
import Modal from "../../../../componets/common/Modal.jsx";
import DataTable from "../../../../componets/common/DataTable.jsx";
import StatusBadge from "../../../../componets/common/StatusBadge.jsx";
import { useGetLedgersQuery } from "../../../../services/ledgerApi.js";
import { useDebounce } from "../../../../utils/useDebounce.js";
import { useGroupIds } from "../../../../hooks/useGroupIds.js";
import Input from "../../../../componets/common/Input.jsx";
import Select from "../../../../componets/common/Select.jsx";

const CreditorLedgerListModal = ({ open, onClose, onSelectLedger }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const debouncedSearch = useDebounce(search, 300);
  const prevDataRef = useRef([]);

  const { creditorGroupIds } = useGroupIds();

  const { 
    data: ledgerData, 
    isLoading, 
    isFetching 
  } = useGetLedgersQuery({
    page,
    limit: 10,
    search: debouncedSearch,
    groupIds: creditorGroupIds,
    isActive: true,
  });

  useEffect(() => {
    setPage(1);
    setData([]);
    prevDataRef.current = [];
  }, [debouncedSearch]);

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
    { key: "ledgerName", title: "Ledger Name" },
    {key : "station", title: "Station"},
    { key: "balance", title: "Balance" },
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
      title="Select Supplier (Creditor)"
    >
      <div className="mb-2 flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center flex-1">
          <Input
            fullWidth={true}
            placeholder="Search supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select options={[{ value: "all", label: "All" }, ...columns.map(c => ({ label: c.title, value: c.key }))]} />
        </div>
      </div>
      <DataTable
        title="Supplier"
        columns={columns}
        data={data || []}
        onRowSelect={(row) => {
          onSelectLedger(row);
          onClose();
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

export default CreditorLedgerListModal;