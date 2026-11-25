import React, { useState, useEffect } from "react";
import AddMFR from "./AddMFR";
import Button from "../../../../components/common/Button";
import { Plus } from "lucide-react";
import {
  useDeleteManufacturerMutation,
  useEditManufacturerMutation,
  useGetManufacturersQuery,
} from "../../../../services/mfrApi";
import CommonPageLayout from "../../../../components/layout/CommonPageLayout";
import { useNavigate } from "react-router-dom";
import Pagination from '../../../../components/common/Pagination';
import { useDebounce } from '../../../../utils/useDebounce';

const MFRPage = () => {
  const [editMFRData, setEditMFRData] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { data, error, isLoading, refetch } = useGetManufacturersQuery({ page, limit, search: debouncedSearch });
  const [editManufacturer] = useEditManufacturerMutation();
  const [deleteManufacturer] = useDeleteManufacturerMutation();
  const [selectedRow, setSelectedRow] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (data?.data && data.data.length > 0) {
      setSelectedRow((prev) => {
        if (!prev || !data.data.find((r) => r.id === prev.id)) {
          return data.data[0];
        }
        return prev;
      });
    }
  }, [data]);

  const columns = [
    { key: "mfrname", title: "Name" },
    { key: "mobile", title: "Mobile No." },
  ];

  const handleAddItem = () => {
    navigate("/master/inventory/manufacturers/create");
  };

  const handleDelete = async (id) => {
    await deleteManufacturer(id);
  };

  const handleEdit = (row) => {
    setEditMFRData(row);
  };

  const handleEditSave = async (formData) => {
    await editManufacturer({ id: editMFRData.id, ...formData });
    setEditMFRData(null);
    refetch();
  };

  const handleRowSelect = (row) => {
    setSelectedRow(row);
  };

  const handleKeyDown = (e) => {
    if (!data?.data || data.data.length === 0) return;
    if (!selectedRow) return;
    const idx = data.data.findIndex((r) => r.id === selectedRow.id);
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
        title="Manufacturer Management"
        subtitle="Manage your Manufacturer"
        actions={[
          <Button key="add" onClick={handleAddItem}>
            <Plus className="w-4 h-4" /> Add Manufacturer
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
        rowInfoPanel={
          selectedRow && (
            <div className="flex flex-col gap-1 text-xs">
              <div>
                <b>Name:</b> {selectedRow.mfrname}
              </div>
              <div>
                <b>Mobile No.:</b> {selectedRow.mobile}
              </div>
            </div>
          )
        }
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

export default MFRPage;
