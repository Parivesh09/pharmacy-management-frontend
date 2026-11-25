import React, { useState } from "react";
import CommonPageLayout from "../../../../components/layout/CommonPageLayout";
import Button from "../../../../components/common/Button";
import Pagination from "../../../../components/common/Pagination";
import { Plus } from "lucide-react";
import {
  useAddStationMutation,
  useDeleteStationMutation,
  useGetStationsQuery,
  useUpdateStationMutation,
} from "../../../../services/stationApi";
import Modal from "../../../../components/common/Modal";
import AddStationModal from "./AddStationModal";
import { Toast, showToast } from "../../../../components/common/Toast";

const columns = [{ key: "name", title: "Name" }];

const Station = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedStation, setSelectedStation] = useState(null);
  const {
    data: stations,
    isLoading,
    error,
  } = useGetStationsQuery({ page, limit: 10, search });
  const [addStation, { isLoading: isAdding }] = useAddStationMutation();
  const [updateStation, { isLoading: isUpdating }] = useUpdateStationMutation();
  const [deleteStation, { isLoading: isDeleting }] = useDeleteStationMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [stationName, setStationName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editStation, setEditStation] = useState(null);

  const handleAddItem = async () => {
    setIsOpen(true);
  };

  const handleEditItem = async (item) => {
    setEditMode(true);
    setEditStation(item);
    setIsOpen(true);
  };

  const handleDeleteItem = async (item) => {
    await deleteStation(item.id);
    showToast("Station deleted!");
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setEditMode(false);
    setEditStation(null);
    setStationName("");
  };

  const handleAddStation = async () => {
    if (!stationName.trim()) {
      showToast("name cannot be empty", { type: "warning" });
    } else {
      setIsOpen(false);
      await addStation({ name: stationName.trim() });
      showToast("Station added!");
      setStationName("");
    }
  };

  const handleUpdateStation = async () => {
    if (!editStation.name.trim()) {
      showToast("name cannot be empty", { type: "warning" });
    } else {
      setIsOpen(false);
      await updateStation({ id: editStation.id, name: editStation.name.trim() });
      showToast("Station updated!");
    }
  };

  return (
    <>
      <CommonPageLayout
        title="Station List"
        actions={[
          <Button key="add" onClick={handleAddItem}>
            <Plus className="w-4 h-4" /> Add Station
          </Button>,
        ]}
        tableData={stations?.data || []}
        isLoading={isLoading}
        error={error}
        page={page}
        search={search}
        setSearch={setSearch}
        totalPages={stations?.totalPages || 1}
        total={stations?.total || 0}
        onPageChange={setPage}
        onSearchChange={setSearch}
        onAdd={handleAddItem}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
        columns={columns}
      />
      <AddStationModal
        isOpen={isOpen}
        handleCloseModal={handleCloseModal}
        handleAddStation={editMode ? handleUpdateStation : handleAddStation}
        stationName={stationName}
        setStationName={setStationName}
        editMode={editMode}
        setEditMode={setEditMode}
        editStation={editStation}
        setEditStation={setEditStation}
      />
    </>
  );
};

export default Station;
