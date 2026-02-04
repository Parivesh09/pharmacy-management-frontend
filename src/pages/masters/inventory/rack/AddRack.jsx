import { useState, useEffect } from "react";
import { useAddRackMutation } from "../../../../services/rackApi";
import Modal from "../../../../componets/common/Modal";
import Input from "../../../../componets/common/Input";
import Button from "../../../../componets/common/Button";
import { useForm } from "react-hook-form";
import { TextField } from "../../../../componets/common/Fields";
import { useGetStoresQuery } from "../../../../services/storeApi";
import SearchableSelect from "../../../../componets/common/SearchableSelect";
import AddStore from "../store/AddStore";

export default function AddRack({
  isOpen = true,
  onClose = () => {},
  initialData = null,
  onSave,
}) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [addRack, { isLoading }] = useAddRackMutation();
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [shouldReopenRack, setShouldReopenRack] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      storeid: "",
      rackname: "",
    },
  });

  useEffect(() => {
    if (errors && errors.storeid) {
      console.warn("Validation error:", errors.storeid);
    }
  }, [errors]);

  const { data: stores = [] } = useGetStoresQuery();
  const selectedStoreId = watch("storeid");
  const selectedStore = stores?.data?.find((s) => s.id === selectedStoreId);

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({ storeid: "", rackname: "" });
    }
  }, [initialData, isOpen, reset]);

  const handleSave = async (data) => {
    setError("");
    setSuccess("");
    try {
      if (onSave) {
        await onSave(data);
        setSuccess("Rack saved successfully!");
        reset();
        onClose();
        console.log("in on save");
      } else {
        console.log("in else on save", data);
        await addRack(data).unwrap();
        setSuccess("Rack created successfully!");
        reset();
        onClose();
      }
    } catch (err) {
      setError(err?.data?.message || "Failed to save rack");
    }
  };

  return (
    <>
      <AddStore
        isOpen={isStoreModalOpen}
        onClose={() => {
          setIsStoreModalOpen(false);

          if (shouldReopenRack) {
            setTimeout(() => {
              setShouldReopenRack(false);
              onClose(false); 
            }, 0);
          }
        }}
      />
      <Modal open={isOpen && !isStoreModalOpen} onClose={onClose} title={initialData ? "EDIT RACK" : "CREATE RACK"}>
        <form onSubmit={handleSubmit(handleSave)} className="space-y-6 py-4">
          <input type="hidden" {...register("storeid", { required: true })} />
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
              Select Storage Store <span className="text-red-500">*</span>
            </label>
            <SearchableSelect
              options={stores?.data?.map((s) => ({ label: s.storename, value: s.id }))}
              value={selectedStoreId}
              allowCreate={true}
              onChange={(opt) => {
                if (opt.isNew) {
                  setShouldReopenRack(true);
                  setIsStoreModalOpen(true);
                  onClose();
                  return;
                }
                setValue("storeid", opt.value, { shouldValidate: true });
              }}
              placeholder="Search or select store..."
              className="bg-transparent border-gray-200 dark:border-gray-700 font-bold"
            />
            {errors.storeid && (
              <div className="text-red-600 font-bold text-[10px] uppercase tracking-wider mt-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                Please select a valid store location
              </div>
            )}
          </div>
          <TextField
            label="Rack / Shelf Identifier"
            name="rackname"
            register={register}
            errors={errors}
            required
            className="bg-transparent border-gray-200 dark:border-gray-700 font-black h-12 text-lg"
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
              {initialData ? "Update Rack" : "Save Rack"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
