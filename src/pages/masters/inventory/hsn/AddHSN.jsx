import React, { useState, useEffect } from "react";
import { useAddHSNMutation } from "../../../../services/hsnApi";
import Modal from "../../../../componets/common/Modal";
import Input from "../../../../componets/common/Input";
import Button from "../../../../componets/common/Button";
import { TextField } from "../../../../componets/common/Fields";
import { useForm } from "react-hook-form";
import { showToast } from "../../../../componets/common/Toast";

export default function CreateHsnSacForm({
  isOpen = true,
  onClose = () => {},
  initialData = null,
  onSave,
}) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [addHSN, { isLoading }] = useAddHSNMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      hsnSacCode: "",
      hsnsacname: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({ hsnSacCode: "", hsnsacname: "" });
    }
  }, [initialData, isOpen, reset]);

  const handleSave = async (data) => {
    setError("");
    setSuccess("");
    try {
      if (onSave) {
        await onSave(data);
        setSuccess("HSN saved successfully!");
        showToast("HSN saved successfully!", { type: "success" });
        reset();
        onClose();
      } else {
        await addHSN(data).unwrap();
        setSuccess("HSN created successfully!");
        showToast("HSN created successfully!", { type: "success" });
        reset();
        onClose();
      }
    } catch (err) {
      setError(err?.data?.message || "Failed to save HSN");
      showToast(err?.data?.message || "Failed to save HSN", { type: "error" });
    }
  };

  const handleClear = () => {
    reset();
  };

  return (
    <Modal open={isOpen} onClose={onClose} title={initialData ? "EDIT HSN / SAC" : "CREATE HSN / SAC"}>
      <form
        onSubmit={handleSubmit(handleSave)}
        className="space-y-6 py-4"
      >
        <TextField
          label="HSN / SAC Numeric Code"
          name="hsnSacCode"
          register={register}
          errors={errors}
          required
          message="HSN/SAC Code is required"
          className="bg-transparent border-gray-200 dark:border-gray-700 font-black h-12 text-lg"
        />
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
            Description / Category Name
          </label>
          <Input 
            type="text" 
            {...register("hsnsacname")} 
            className="w-full bg-transparent border-gray-200 dark:border-gray-700 font-bold" 
            placeholder="e.g. Pharmaceutical Products"
          />
        </div>
        
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
            {initialData ? "Update HSN" : "Save HSN"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
