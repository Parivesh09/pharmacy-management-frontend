import React, { useState } from "react";
import Modal from "../../../../components/common/Modal.jsx";
import DataTable from "../../../../components/common/DataTable.jsx";
import StatusBadge from "../../../../components/common/StatusBadge.jsx";
import { useGetPatientsQuery } from "../../../../services/patientApi.js";
import { useDebounce } from "../../../../utils/useDebounce.js";
import Pagination from "../../../../components/common/Pagination.jsx";
import Input from "../../../../components/common/Input.jsx";
import Select from "../../../../components/common/Select.jsx";

const PatientListModal = ({ open, onClose, onSelectPatient }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useGetPatientsQuery({
    page,
    limit: 10,
    search: debouncedSearch,
  });

  const columns = [
    { key: "phone", title: "Mobile No" },
    // { key: "id", title: "ID" },
    { key: "name", title: "Name" },
    { key: "gender", title: "Gender" },
    { key: "age", title: "Age" },
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
      className="max-w-full md:max-w-[50vw]"
      title="Patient List"
    >
      <div className="mb-2 flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center flex-1">
          <Input
            fullWidth={true}
            placeholder="Search here.."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select options={[{ value: "all", label: "All" }, ...columns.map(c => ({ label: c.title, value: c.key }))]} />
        </div>
      </div>
      <DataTable
        title="Patient"
        columns={columns}
        data={data?.data || []}
        onRowSelect={(row) => {
          onSelectPatient(row);
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

export default PatientListModal;
