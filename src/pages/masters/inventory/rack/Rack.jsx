import React, { useState, useEffect, useMemo } from "react";
import AddRack from "./AddRack";
import Button from "../../../../components/common/Button";
import { Plus } from "lucide-react";
import {
  useDeleteRackMutation,
  useEditRackMutation,
  useGetRacksQuery,
} from "../../../../services/rackApi";
import CommonPageLayout from "../../../../components/layout/CommonPageLayout";
import Pagination from "../../../../components/common/Pagination";
import { useDebounce } from "../../../../utils/useDebounce";

const RackPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editRackData, setEditRackData] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { data, error, isLoading, refetch } = useGetRacksQuery({
    page,
    limit,
    search: debouncedSearch,
  });
  const [editRack] = useEditRackMutation();
  const [deleteRack] = useDeleteRackMutation();
  const [selectedRow, setSelectedRow] = useState(null);

  const racks = data || {};

  const tableData = useMemo(
    () =>
      (racks.data || []).map((rack) => ({
        ...rack,
        storename: rack.store?.storename || "",
      })),
    [racks]
  );

  useEffect(() => {
    if (tableData && tableData.length > 0) {
      setSelectedRow((prev) => {
        if (!prev || !tableData.find((r) => r.id === prev.id)) {
          return tableData[0];
        }
        return tableData.find((r) => r.id === prev.id) || tableData[0];
      });
    }
  }, [tableData]);

  const columns = [
    { key: "rackname", title: "Rack Name" },
    {
      key: "storename",
      title: "Store Name",
    },
  ];

  const handleAddItem = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    refetch();
  };

  const handleDelete = async (id) => {
    await deleteRack(id);
  };
  const handleEdit = (row) => {
    setEditRackData(row);
    setEditModalOpen(true);
  };

  const handleEditSave = async (formData) => {
    await editRack({ id: editRackData.id, ...formData });
    setEditModalOpen(false);
    setEditRackData(null);
    refetch();
  };

  const handleRowSelect = (row) => {

    const found = tableData.find((r) => r.id === row.id);
    setSelectedRow(found || row);
  };

  const handleKeyDown = (e) => {
    if (!tableData || tableData.length === 0) return;
    if (!selectedRow) return;
    const idx = tableData.findIndex((r) => r.id === selectedRow.id);
    if (e.key === "ArrowDown") {
      const nextIdx = idx < tableData.length - 1 ? idx + 1 : 0;
      setSelectedRow(tableData[nextIdx]);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      const prevIdx = idx > 0 ? idx - 1 : tableData.length - 1;
      setSelectedRow(tableData[prevIdx]);
      e.preventDefault();
    }
  };

  return (
    <>
      <CommonPageLayout
        title="Rack Management"
        subtitle="Manage your Rack"
        actions={[
          <Button key="add" onClick={handleAddItem}>
            <Plus className="w-4 h-4" /> Add Rack
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
      <AddRack isOpen={isModalOpen} onClose={handleCloseModal} />
      <AddRack
        initialData={editRackData}
        onSave={handleEditSave}
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditRackData(null);
        }}
      />
    </>
  );
};

export default RackPage;
