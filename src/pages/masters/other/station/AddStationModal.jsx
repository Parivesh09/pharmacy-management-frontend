import React, { useState } from "react";
import Modal from "../../../../components/common/Modal";
import Input from "../../../../components/common/Input";
import Button from "../../../../components/common/Button";

const AddStationModal = ({
  isOpen,
  handleCloseModal,
  handleAddStation,
  stationName,
  setStationName,
  editMode,
  setEditMode,
  editStation,
  setEditStation,
}) => {
  const onChange = (e) => {
    if (editMode) {
      setEditStation({ ...editStation, name: e.target.value });
    } else {
      setStationName(e.target.value);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleCloseModal}
      title="Add Station"
      className="max-w-2xl"
    >
      <div className="space-y-4">
        <Input
          label="Station Name"
          value={editMode ? editStation.name : stationName}
          onChange={(e) => onChange(e)}
        />
        <Button variant="primary" onClick={handleAddStation}>
          {editMode ? "Update" : "Add"} Station
        </Button>
      </div>
    </Modal>
  );
};

export default AddStationModal;
