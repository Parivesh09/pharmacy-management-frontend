import { useEffect, useMemo, useState } from "react";
import CommonPageLayout from "../../../../components/layout/CommonPageLayout";
import Button from "../../../../components/common/Button";
import { Plus } from "lucide-react";
import {
  useDeletePatientMutation,
  useGetPatientsQuery,
} from "../../../../services/patientApi";
import { useDebounce } from "../../../../utils/useDebounce";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../../../components/common/StatusBadge";

const Patient = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { data: patients, isLoading } = useGetPatientsQuery({
    page,
    limit,
    search: debouncedSearch,
  });
  const [deletePatient] = useDeletePatientMutation();

  const [selectedPatient, setSelectedPatient] = useState(null);
  const navigate = useNavigate();

  const tableData = useMemo(() => patients?.data || [], [patients]);

  const columns = [
    { key: "phone", title: "Mobile No" },
    { key: "id", title: "ID" },
    { key: "name", title: "Name" },
    { key: "gender", title: "Gender" },
    { key: "age", title: "Age" },
    {
      key: "status",
      title: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  useEffect(() => {
    if (tableData && tableData.length > 0) {
      setSelectedPatient((prev) => {
        if (!prev || !tableData.find((r) => r.id === prev.id)) {
          return tableData[0];
        }
        return prev;
      });
    }
  }, [tableData]);

  const handleAddItem = () => navigate("/master/other/patient/create");

  const handleDelete = async (row) => {
    try {
      await deletePatient(row.id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (row) => navigate(`/master/other/patient/edit/${row.id}`);

  return (
    <CommonPageLayout
      title="Patient"
      actions={[
        <Button key="add" onClick={handleAddItem}>
          <Plus className="w-4 h-4" /> Add patient
        </Button>,
      ]}
      search={search}
      onSearchChange={(e) => {
        setSearch(e.target.value);
        setPage(1);
      }}
      tableData={tableData}
      columns={columns}
      isLoading={isLoading}
      selectedRow={selectedPatient}
      onRowSelect={setSelectedPatient}
      onAdd={handleAddItem}
      onEdit={handleEdit}
      onDelete={handleDelete}
      page={page}
      totalPages={patients?.totalPages || 1}
      onPageChange={setPage}
    />
  );
};

export default Patient;
