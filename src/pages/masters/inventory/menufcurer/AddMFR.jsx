import { useState } from "react";
import { useAddManufacturerMutation } from "../../../../services/mfrApi";
import Input from "../../../../componets/common/Input";
import Button from "../../../../componets/common/Button";
import { useForm } from "react-hook-form";
import { SelectField, TextField } from "../../../../componets/common/Fields";
import { useNavigate } from "react-router-dom";
import { Eraser, SaveIcon, X } from "lucide-react";

export default function CreateManufacturerPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [addManufacturer, { isLoading }] = useAddManufacturerMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      mfrname: "",
      shortname: "",
      country: "India",
      state: "",
      address: "",
      email: "",
      phone: "",
      mobile: "",
      contactperson: "",
      status: "Continue",
      prohibited: "No",
    },
  });

  const handleSave = async (data) => {
    setError("");
    setSuccess("");
    try {
      await addManufacturer(data).unwrap();
      setSuccess("Manufacturer created successfully!");
      reset();
      navigate("/master/inventory/manufacturers");
    } catch (err) {
      setError(err?.data?.message || "Failed to save manufacturer");
    }
  };

  const handleClear = () => {
    reset();
  };

  const handleClose = () => {
    navigate("/master/inventory/manufacturers");
  };

  return (
    <div className="flex flex-col min-h-screen bg-(--bg-main) p-4 tracking-tight">
      <form
        onSubmit={handleSubmit(handleSave)}
        className="flex-1 flex flex-col relative"
      >
        <div className="bg-(--card-bg) rounded-3xl shadow-2xl p-8 max-w-4xl mx-auto w-full border border-gray-100 dark:border-white/5 transition-all duration-500">
          <div className="flex items-center justify-between sticky top-0 z-10 bg-(--card-bg) border-b border-gray-200 dark:border-white/5 pb-4 mb-8">
            <h1 className="text-3xl font-black italic tracking-tighter text-(--text-main)">CREATE MANUFACTURER</h1>
            <Button type="button" variant="secondary" onClick={handleClose}>
              &#8592; Back to List
            </Button>
          </div>

          <div className="mb-8">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
              Manufacturer Entity Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              {...register("mfrname", { required: "Name is required" })}
              className="h-12 text-lg font-bold w-full bg-transparent border-gray-400 dark:border-gray-700 focus:ring-2 focus:ring-(--primary-color)"
              placeholder="e.g. Pharmaceutical Labs Pvt Ltd"
            />
            {errors.mfrname && ( // Fixed error lookup to use mfrname
              <p className="text-red-500 text-xs font-bold mt-1 uppercase tracking-wider">{errors.mfrname.message}</p>
            )}
          </div>

          <div className="mb-8">
            <label className="flex items-center gap-3 p-4 rounded-2xl bg-(--sidebar-active-bg) border border-(--primary-color)/10 cursor-pointer group transition-all w-fit pr-8">
              <Input
                width="w-5"
                type="checkbox"
                {...register("showMoreOptions")}
                onChange={(e) => setShowMore(e.target.checked)}
                className="w-5 h-5 text-(--primary-color) border-gray-400 rounded-lg focus:ring-(--primary-color)"
              />
              <div className="flex flex-col">
                <span className="font-bold text-sm text-(--text-main) tracking-tight">
                  Detailed Information
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Configure address, contact and legal status
                </span>
              </div>
            </label>
          </div>

          {showMore && (
            <div className="p-8 rounded-3xl bg-(--sidebar-active-bg)/30 border border-(--primary-color)/5 mb-8 animate-fade-in space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <TextField
                  label="Office Phone"
                  name="phone"
                  register={register}
                  errors={errors}
                  className="bg-transparent border-gray-400 dark:border-gray-700"
                />
                <TextField
                  label="Direct Mobile"
                  name="mobile"
                  register={register}
                  errors={errors}
                  className="bg-transparent border-gray-400 dark:border-gray-700"
                />
                <TextField
                  label="Headquarters Country"
                  name="country"
                  register={register}
                  errors={errors}
                  className="bg-transparent border-gray-400 dark:border-gray-700 font-bold"
                />
                <TextField
                  label="State / Province"
                  name="state"
                  register={register}
                  errors={errors}
                  className="bg-transparent border-gray-400 dark:border-gray-700 font-bold"
                />
              </div>
              <TextField
                label="Registered Office Address"
                name="address"
                register={register}
                errors={errors}
                className="bg-transparent border-gray-400 dark:border-gray-700"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <TextField
                  label="Primary Contact Person"
                  name="contactperson"
                  register={register}
                  errors={errors}
                  className="bg-transparent border-gray-400 dark:border-gray-700 font-bold"
                />
                <TextField
                  label="Official Email Address"
                  name="email"
                  register={register}
                  errors={errors}
                  className="bg-transparent border-gray-400 dark:border-gray-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-5 pt-4 border-t border-gray-200 dark:border-white/5">
                <SelectField
                  label="Operational Status"
                  options={["Continue", "Discontinue"]}
                  name="status"
                  register={register}
                  className="bg-transparent border-gray-400 dark:border-gray-700 font-bold"
                />
                <SelectField
                  label="Legal Prohibition"
                  options={["No", "Yes"]}
                  name="prohibited"
                  register={register}
                  className="bg-transparent border-gray-400 dark:border-gray-700 font-bold"
                />
              </div>
            </div>
          )}

          
          {error && <div className="text-red-500 font-bold text-xs uppercase tracking-widest mb-4 animate-fade-in">❌ {error}</div>}
          {success && <div className="text-green-500 font-bold text-xs uppercase tracking-widest mb-4 animate-fade-in">✅ {success}</div>}

          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-white/5 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              className="px-8"
            >
              Reset
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleClose}
              className="px-8"
            >
              Close
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="px-12 shadow-xl shadow-(--primary-color)/20"
            >
              Save Manufacturer
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
