import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import AddUnit from "../unit/AddUnit";
import { useDeleteUnitMutation, useEditUnitMutation, useGetUnitsQuery } from "../../../../services/unitApi";
import Button from "../../../../components/common/Button";
import CommonPageLayout from "../../../../components/layout/CommonPageLayout";
import Pagination from '../../../../components/common/Pagination';
import { useDebounce } from '../../../../utils/useDebounce';

const UnitPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editUnitData, setEditUnitData] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { data, error, isLoading, refetch } = useGetUnitsQuery({ page, limit, search: debouncedSearch });
  const [editUnit] = useEditUnitMutation();
  const [deleteUnit] = useDeleteUnitMutation();
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    if (data?.data && data.data.length > 0) {
      setSelectedRow((prev) => {
        if (!prev || !data.data.find((u) => u.id === prev.id)) {
          return data.data[0];
        }
        return prev;
      });
    }
  }, [data]);

  const columns = [
    { key: "unitName", title: "Unit Name" },
    { key: "uqc", title: "UQC" },
  ];

  const handleAddItem = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    refetch();
  };

  const handleDelete = async (row) => {
    await deleteUnit(row.id);
  };
  const handleEdit = (row) => {
    setEditUnitData(row);
    setEditModalOpen(true);
  };

  const handleEditSave = async (formData) => {
    await editUnit({ id: editUnitData.id, ...formData });
    setEditModalOpen(false);
    setEditUnitData(null);
    refetch();
  };

  const handleRowSelect = (row) => {
    setSelectedRow(row);
  };

  const handleKeyDown = (e) => {
    if (!data?.data || data.data.length === 0) return;
    if (!selectedRow) return;
    const idx = data.data.findIndex((u) => u.id === selectedRow.id);
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
        title="Unit Management"
        subtitle="Manage your Unit"
        actions={[
          <Button key="add" onClick={handleAddItem}>
            <Plus className="w-4 h-4" /> Create Unit
          </Button>,
        ]}
        search={search}
        onSearchChange={e => { setSearch(e.target.value); setPage(1); }}
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
      <AddUnit isOpen={isModalOpen} onClose={handleCloseModal} />
      <AddUnit
        initialData={editUnitData}
        onSave={handleEditSave}
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditUnitData(null);
        }}
      />
    </>
  );
};

export default UnitPage;
