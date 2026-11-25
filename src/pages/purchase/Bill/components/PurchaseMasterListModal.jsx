import React, { useState } from "react";
import Modal from "../../../../components/common/Modal.jsx";
import DataTable from "../../../../components/common/DataTable.jsx";
import StatusBadge from "../../../../components/common/StatusBadge.jsx";
import { useGetPurchaseMastersQuery } from "../../../../services/purchaseMasterApi.js";
import { useDebounce } from "../../../../utils/useDebounce.js";
import Pagination from "../../../../components/common/Pagination.jsx";
import Input from "../../../../components/common/Input.jsx";

const PurchaseMasterListModal = ({ open, onClose, onSelectPurchaseMaster }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useGetPurchaseMastersQuery({
    page,
    limit: 10,
    search: debouncedSearch,
  });

  const columns = [
    { key: "purchaseType", title: "Purchase Type" },
    {
      key: "igstPercentage",
      title: "IGST %",
      render: (value) => <div>{value || 0}%</div>,
    },
    {
      key: "cgstPercentage",
      title: "CGST %",
      render: (value) => <div>{value || 0}%</div>,
    },
    {
      key: "sgstPercentage",
      title: "SGST %",
      render: (value) => <div>{value || 0}%</div>,
    },
    {
      key: "cessPercentage",
      title: "CESS %",
      render: (value) => <div>{value || 0}%</div>,
    },
    {
      key: "status",
      title: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="max-w-full md:max-w-[60vw]"
      title="Select Purchase Master (Tax Category)"
    >
      <div className="mb-2 flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center flex-1">
          <Input
            fullWidth={true}
            placeholder="Search purchase master..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <DataTable
        title="Purchase Master"
        columns={columns}
        data={data?.data || []}
        onRowSelect={(row) => {
          onSelectPurchaseMaster(row);
          onClose();
        }}
        isLoading={isLoading}
      />
      <div className="mt-2">
        <Pagination
          page={page}
          totalPages={data?.totalPages || 1}
          onPageChange={setPage}
        />
      </div>
    </Modal>
  );
};

export default PurchaseMasterListModal;
