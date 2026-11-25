import React, { useState } from "react";
import Modal from "../../../../components/common/Modal.jsx";
import DataTable from "../../../../components/common/DataTable.jsx";
import StatusBadge from "../../../../components/common/StatusBadge.jsx";
import { useDebounce } from "../../../../utils/useDebounce.js";
import Pagination from "../../../../components/common/Pagination.jsx";
import Input from "../../../../components/common/Input.jsx";
import Select from "../../../../components/common/Select.jsx";
import { useGetDoctorsQuery } from "../../../../services/doctorApi.js";
import CreateDoctorModal from "./CreateDoctorModal";
import Button from "../../../../components/common/Button.jsx";
import { useCreateDoctorMutation } from "../../../../services/doctorApi.js";
import { showToast } from "../../../../components/common/Toast.jsx";

const DoctorListModal = ({ open, onClose, onSelectDoctor }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);
  const [showCreateDoctorModal, setShowCreateDoctorModal] = useState(false);
  const [createDoctor, { isLoading: isCreating, error: createError }] = useCreateDoctorMutation();
  const [apiError, setApiError] = useState("");

  const handleCreateDoctor = async (doctor) => {
    try {
      const result = await createDoctor(doctor).unwrap();
      if (result && result.data) {
        showToast("Doctor created successfully!", { type: "success" });
        onSelectDoctor(result.data);
        setShowCreateDoctorModal(false);
        onClose();
      } else {
        showToast("Failed to create doctor. Please try again.", { type: "error" });
      }
    } catch (err) {
      showToast(err?.data?.message || "Failed to create doctor. Please try again.", { type: "error" });
    }
  };

  const { data, isLoading } = useGetDoctorsQuery({
    page,
    limit: 10,
    search: debouncedSearch,
  });

  const columns = [
    { key: "mobileNo", title: "Mobile No" },
    { key: "id", title: "ID" },
    { key: "name", title: "Name" },
    { key: "regNo", title: "Reg. No." },
    { key: "hospitalName", title: "Hospital Name" },
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
      title="Doctor List"
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
        <Button
          variant="primary"
          onClick={() => setShowCreateDoctorModal(true)}
        >
          + Add Doctor
        </Button>
      </div>
      <DataTable
        title="Doctor"
        columns={columns}
        data={data?.data || []}
        onRowSelect={(row) => {
          onSelectDoctor(row);
          onClose();
        }}
        isLoading={isLoading}
        handleAddItem={() => setShowCreateDoctorModal(true)}
      />
      <div className="mt-2">
        <Pagination
          page={page}
          totalPages={data?.totalPages || 1}
          onPageChange={setPage}
        />
      </div>
      <CreateDoctorModal
        open={showCreateDoctorModal}
        onClose={() => setShowCreateDoctorModal(false)}
        onSave={handleCreateDoctor}
      />
    </Modal>
  );
};

export default DoctorListModal; 