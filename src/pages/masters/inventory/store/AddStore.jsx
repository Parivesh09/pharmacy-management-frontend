import { useState, useEffect } from "react";
import { useAddStoreMutation } from "../../../../services/storeApi";
import Input from "../../../../componets/common/Input";
import Button from "../../../../componets/common/Button";
import Modal from "../../../../componets/common/Modal";
import { useForm } from "react-hook-form";
import { showToast } from "../../../../componets/common/Toast";

export default function AddStore({
  isOpen = true,
  onClose = () => {},
  initialData = null,
  onSave,
}) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [addStore, { isLoading }] = useAddStoreMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      storecode: "",
      storename: "",
      address1: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({ storecode: "", storename: "", address1: "" });
    }
  }, [initialData, isOpen, reset]);

  if (!isOpen) return null;

  const handleSave = async (data) => {
    setError("");
    setSuccess("");
    try {
      if (onSave) {
        await onSave(data);
        showToast("Store saved successfully!", { type: "success" });
        reset();
        onClose();
      } else {
        await addStore(data);
        showToast("Store created successfully!", { type: "success" });
        reset();
        onClose();
      }
    } catch (err) {
      setError(err?.data?.message || "Failed to save store");
      showToast(err?.data?.message || "Failed to save store", {
        type: "error",
      });
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} title={initialData ? "EDIT STORE / LOCATION" : "CREATE STORE / LOCATION"}>
      <form onSubmit={handleSubmit(handleSave)} className="space-y-6 py-4">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
            Store ID / Code <span className="text-red-500">*</span>
          </label>
          <Input
            {...register("storecode", { required: "Store Code is required" })}
            required
            className="bg-transparent border-gray-200 dark:border-gray-700 font-bold uppercase"
            placeholder="e.g. STR-001"
          />
          {errors.storecode && (
            <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">
              {errors.storecode.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
            Store / Branch Name <span className="text-red-500">*</span>
          </label>
          <Input
            {...register("storename", { required: "Store Name is required" })}
            required
            className="bg-transparent border-gray-200 dark:border-gray-700 font-black h-12 text-lg"
            placeholder="e.g. Main Warehouse"
          />
          {errors.storename && (
            <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">
              {errors.storename.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
            Full Address / Details <span className="text-red-500">*</span>
          </label>
          <Input
            {...register("address1", { required: "Address is required" })}
            required
            className="bg-transparent border-gray-200 dark:border-gray-700 font-medium"
            placeholder="Enter store location address..."
          />
          {errors.address1 && (
            <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{errors.address1.message}</p>
          )}
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
            {initialData ? "Update Store" : "Save Store"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
