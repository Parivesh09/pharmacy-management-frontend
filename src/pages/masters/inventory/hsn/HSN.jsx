import React, { useState, useEffect } from "react";
import AddHSN from "./AddHSN";
import Button from "../../../../components/common/Button";
import { Plus } from "lucide-react";
import {
  useDeleteHSNMutation,
  useEditHSNMutation,
  useGetHSNsQuery,
} from "../../../../services/hsnApi";
import CommonPageLayout from "../../../../components/layout/CommonPageLayout";
import Pagination from "../../../../components/common/Pagination";
import { useDebounce } from "../../../../utils/useDebounce";
import { useSelector } from "react-redux";

const HSNPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editHSNData, setEditHSNData] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { currentCompany } = useSelector((state) => state.user);
  const { data, error, isLoading, refetch } = useGetHSNsQuery(
    { page, limit, search: debouncedSearch, companyId: currentCompany?.id },
    { skip: !currentCompany?.id }
  );
  const [editHSN] = useEditHSNMutation();
  const [deleteHSN] = useDeleteHSNMutation();
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    if (data?.data && data.data.length > 0) {
      setSelectedRow((prev) => {
        if (!prev || !data.data.find((h) => h.id === prev.id)) {
          return data.data[0];
        }
        return prev;
      });
    }
  }, [data]);

  const columns = [
    { key: "hsnsacname", title: "Name" },
    { key: "hsnSacCode", title: "HSN Code" },
  ];

  const handleAddItem = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // refetch();
  };

  const handleEdit = (row) => {
    setEditHSNData(row);
    setEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteHSN(id);
  };

  const handleEditSave = async (formData) => {
    await editHSN({ id: editHSNData.id, ...formData });
    setEditModalOpen(false);
    setEditHSNData(null);
    // refetch();
  };

  const handleRowSelect = (row) => {
    setSelectedRow(row);
  };

  const handleKeyDown = (e) => {
    if (!data?.data || data.data.length === 0) return;
    if (!selectedRow) return;
    const idx = data.data.findIndex((h) => h.id === selectedRow.id);
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
    <>
      <CommonPageLayout
        title="HSN Management"
        subtitle="Manage your HSN/SAC"
        actions={[
          <Button
            key="add"
            onClick={handleAddItem}
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" /> Create HSN/SAC
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
      <AddHSN isOpen={isModalOpen} onClose={handleCloseModal} />
      <AddHSN
        initialData={editHSNData}
        onSave={handleEditSave}
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditHSNData(null);
        }}
      />
    </>
  );
};

export default HSNPage;
