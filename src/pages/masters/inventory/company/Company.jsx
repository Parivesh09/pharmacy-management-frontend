import React, { useState, useEffect } from "react";
import Button from "../../../../components/common/Button";
import { Plus } from "lucide-react";
import {
  useDeleteCompanyMutation,
  useGetCompaniesQuery,
} from "../../../../services/companyApi";
import { useNavigate } from "react-router-dom";
import CommonPageLayout from "../../../../components/layout/CommonPageLayout";
import Pagination from "../../../../components/common/Pagination";
import { useDebounce } from "../../../../utils/useDebounce";
import { useSelector } from "react-redux";

const CompanyPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { currentCompany } = useSelector((state) => state.user);
  const { data, error, isLoading, refetch } = useGetCompaniesQuery(
    { page, limit, search: debouncedSearch, companyId: currentCompany?.id },
    { skip: !currentCompany?.id }
  );
  const [deleteCompany] = useDeleteCompanyMutation();
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    if (data?.data && data.data.length > 0) {
      setSelectedRow((prev) => {
        if (!prev || !data.data.find((c) => c.id === prev.id)) {
          return data.data[0];
        }
        return prev;
      });
    }
  }, [data]);

  const columns = [{ key: "companyname", title: "Company Name" }];

  const handleAddItem = () => {
    navigate("/master/inventory/company/create");
  };

  const handleEdit = (row) => {
    navigate(`/master/inventory/companies/edit/${row.id}`);
  };

  const handleDelete = async (id) => {
    await deleteCompany(id);
    refetch();
  };

  const handleRowSelect = (row) => {
    setSelectedRow(row);
  };

  const handleKeyDown = (e) => {
    if (!data?.data || data.data.length === 0) return;
    if (!selectedRow) return;
    const idx = data.data.findIndex((c) => c.id === selectedRow.id);
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

  return (
    <CommonPageLayout
      title="Company Management"
      subtitle="Manage your Company"
      actions={[
        <Button
          key="add"
          onClick={handleAddItem}
          startIcon={<Plus className="w-4 h-4" />}
          className="w-full sm:w-auto"
        >
          Add Company
        </Button>,
      ]}
      search={search}
      onSearchChange={(e) => {
        setSearch(e.target.value);
        setPage(1);
      }}
      tableData={data?.data || []}
      columns={columns}
      isLoading={isLoading}
      selectedRow={selectedRow}
      onRowSelect={handleRowSelect}
      onAdd={handleAddItem}
      onEdit={handleEdit}
      onDelete={(row) => handleDelete(row.id)}
      onArrowNavigation={handleKeyDown}
    >
      <Pagination
        page={page}
        totalPages={data?.totalPages || 1}
        onPageChange={setPage}
      />
    </CommonPageLayout>
  );
};

export default CompanyPage;
