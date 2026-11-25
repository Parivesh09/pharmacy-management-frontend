import React, { useEffect, useMemo, useState } from "react";
import CommonPageLayout from "../../../../components/layout/CommonPageLayout";
import Button from "../../../../components/common/Button";
import { Plus } from "lucide-react";
import Pagination from "../../../../components/common/Pagination";
import { useDebounce } from "../../../../utils/useDebounce";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../../../components/common/StatusBadge";





const PrescriptionList = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const navigate = useNavigate();







  const data = [];

  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const tableData = useMemo(() => data?.data || [], [data]);

  const columns = [
    { key: "presNo", title: "Prescription No." },
    { key: "presDate", title: "Pr Date" },
    { key: "patient.name", title: "Patient Name" },
    { key: "patient.phone", title: "Mobile No." },
    { key: "doctor.name", title: "Doctor Name" },
    { key: "days", title: "Days" },
    {
      key: "status",
      title: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  useEffect(() => {
    if (tableData && tableData.length > 0) {
      setSelectedPrescription((prev) => {
        if (!prev || !tableData.find((r) => r.id === prev.id)) {
          return tableData[0];
        }
        return prev;
      });
    }
  }, [tableData]);

  const handleAddItem = () => {
    navigate("/masters/other/prescription/create");
  };

  const handleEdit = (row) => {
    navigate(`/masters/other/prescription/edit/${row.id}`);
  };

  const handleDelete = async (row) => {
    try {
      await deletePrescription(row.id);
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const handleKeyDown = (e) => {
    if (!tableData || tableData.length === 0) return;
    if (!selectedPrescription) return;
    const idx = tableData.findIndex((s) => s.id === selectedPrescription.id);
    if (e.key === "ArrowDown") {
      const nextIdx = idx < tableData.length - 1 ? idx + 1 : 0;
      setSelectedPrescription(tableData[nextIdx]);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      const prevIdx = idx > 0 ? idx - 1 : tableData.length - 1;
      setSelectedPrescription(tableData[prevIdx]);
      e.preventDefault();
    }
  };

  return (
    <>
      <CommonPageLayout
        title="Prescription List"
        actions={[
          <Button key="add" onClick={handleAddItem}>
            <Plus className="w-4 h-4" /> Add Prescription
          </Button>,
        ]}
        search={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        tableData={tableData}
        columns={columns}
        onAdd={handleAddItem}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onArrowNavigation={handleKeyDown}
      >
        <Pagination
          page={page}
          totalPages={data?.totalPages || 1}
          onPageChange={setPage}
        />
      </CommonPageLayout>
    </>
  );
};

export default PrescriptionList;
