import React, { useState, useEffect } from "react";
import { useAddUnitMutation } from "../../../../services/unitApi";
import Modal from "../../../../componets/common/Modal";
import Input from "../../../../componets/common/Input";
import Button from "../../../../componets/common/Button";
import { useForm } from "react-hook-form";
import { TextField } from "../../../../componets/common/Fields";

export default function CreateUnitForm({
  isOpen = true,
  onClose = () => {},
  initialData = null,
  onSave,
}) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [addUnit, { isLoading }] = useAddUnitMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      unitName: "",
      uqc: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({ unitName: "", uqc: "" });
    }
  }, [initialData, isOpen, reset]);

  const handleSave = async (data) => {
    setError("");
    setSuccess("");
    try {
      if (onSave) {
        await onSave(data);
        setSuccess("Unit saved successfully!");
        reset();
        onClose();
      } else {
        await addUnit(data).unwrap();
        setSuccess("Unit created successfully!");
        reset();
        onClose();
      }
    } catch (err) {
      setError(err?.data?.message || "Failed to save unit");
    }
  };

  const handleClear = () => {
    reset();
  };

  return (
    <Modal open={isOpen} onClose={onClose} title={initialData ? "EDIT MEASUREMENT UNIT" : "CREATE MEASUREMENT UNIT"}>
      <form onSubmit={handleSubmit(handleSave)} className="space-y-6 py-4">
        <TextField
          name="unitName"
          label="Unit Display Name (e.g. TAB, BOX)"
          type="text"
          register={register}
          errors={errors}
          required
          className="bg-transparent border-gray-200 dark:border-gray-700 font-bold h-12 uppercase"
        />
        <TextField
          name="uqc"
          label="GST UQC Code"
          type="text"
          register={register}
          errors={errors}
          required
          className="bg-transparent border-gray-200 dark:border-gray-700 font-medium h-12 uppercase"
        />
        
        <div className="flex gap-4 mt-8 pt-4 border-t border-gray-50 dark:border-white/5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="flex-1 shadow-xl shadow-(--primary-color)/20"
          >
            {initialData ? "Update Unit" : "Save Unit"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
