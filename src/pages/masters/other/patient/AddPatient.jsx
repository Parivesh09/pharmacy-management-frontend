import { useForm } from "react-hook-form";
import { useAddPatientMutation, useEditPatientMutation, useGetPatientsQuery } from "../../../../services/patientApi";
import Input from "../../../../componets/common/Input";
import Select from "../../../../componets/common/Select";
import Button from "../../../../componets/common/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { TextField, SelectField } from "../../../../componets/common/Fields";
import { showToast } from "../../../../componets/common/Toast";

const GENDER_OPTIONS = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];
const PATIENT_TYPE_OPTIONS = [
  { label: "Regular", value: "Regular" },
  { label: "BPL Holder", value: "BPL_Holder" },
  { label: "Pensioner", value: "Pensioner" },
  { label: "One Time", value: "One_Time" },
];
const DISEASE_OPTIONS = [
  { label: "---Blank--", value: "" },
  { label: "Diabetes", value: "Diabetes" },
  { label: "Hypertension", value: "Hypertension" },
  { label: "Other", value: "Other" },
];

export default function AddPatient({ isEditMode = false }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [addPatient, { isLoading: isCreating }] = useAddPatientMutation();
  const [editPatient, { isLoading: isEditing }] = useEditPatientMutation();
  const { data: patients } = useGetPatientsQuery({}, { skip: !isEditMode });
  const [showMoreOptions, setShowMoreOptions] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: "",
      code: "",
      name: "",
      gender: "Male",
      age: "",
      ledger: "",
      address: "",
      pin: "",
      phone2: "",
      email: "",
      whatsapp: "",
      dob: "",
      patientType: "Regular",
      disease: "",
      govId: "",
      billDiscount: "0.00",
    },
  });

  useEffect(() => {
    if (isEditMode && id && patients?.data) {
      const patient = patients.data.find((p) => String(p.id) === String(id));
      if (patient) {
        Object.entries(patient).forEach(([key, value]) => {
          setValue(key, value == null ? "" : value);
        });
      }
    }
  }, [isEditMode, id, patients, setValue]);

  const handleSave = async (data) => {
    setError("");
    setSuccess("");
    if (!data.dob || data.dob === "Invalid date" || isNaN(new Date(data.dob).getTime())) {
      data.dob = null;
    }
    try {
      if (isEditMode && id) {
        await editPatient({ id, ...data }).unwrap();
        showToast("Patient updated successfully!", { type: "success" });
      } else {
        await addPatient(data).unwrap();
        showToast("Patient created successfully!", { type: "success" });
      }
      reset();
      navigate("/master/other/patient");
    } catch (err) {
      showToast(err?.data?.message || "Failed to save patient", { type: "error" });
    }
  };

  const handleClear = () => {
    reset();
  };

  const handleBack = () => {
    navigate("/master/other/patient");
  };

  return (
    <div className="flex flex-col min-h-screen bg-(--bg-main) p-4 tracking-tight">
      <div className="bg-(--card-bg) rounded-3xl shadow-2xl p-8 max-w-5xl mx-auto w-full border border-gray-100 dark:border-white/5 transition-all duration-500">
        <div className="flex items-center justify-between sticky top-0 z-10 bg-(--card-bg) border-b border-gray-50 dark:border-white/5 pb-4 mb-8">
          <h1 className="text-3xl font-black italic tracking-tighter text-(--text-main)">
            {isEditMode ? "EDIT PATIENT RECORD" : "CREATE PATIENT RECORD"}
          </h1>
          <Button type="button" variant="secondary" onClick={handleBack}>
            &#8592; Back to List
          </Button>
        </div>
        <form onSubmit={handleSubmit(handleSave)}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 items-center">
                <span className="bg-(--sidebar-active-bg) border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-xs font-bold text-gray-500">+91</span>
                <Input
                  type="text"
                  {...register("phone", { required: "Mobile No. is required" })}
                  placeholder="Enter mobile number"
                  className="bg-transparent border-gray-200 dark:border-gray-700 font-bold"
                />
                <span className="text-[10px] font-black uppercase text-gray-400 ml-2">UID</span>
                <Input
                  type="text"
                  className="w-24 bg-(--sidebar-active-bg)/30 border-gray-200 dark:border-gray-700 font-mono"
                  {...register("code")}
                  placeholder="ID"
                  disabled
                />
              </div>
              {errors.phone && <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider mt-1 block">{errors.phone.message}</span>}
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Primary Residence Address</label>
              <Input 
                type="text" 
                {...register("address")} 
                placeholder="Enter current address..." 
                className="bg-transparent border-gray-200 dark:border-gray-700"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Full Legal Name <span className="text-red-500">*</span></label>
              <Input 
                type="text" 
                {...register("name", { required: "Name is required" })} 
                placeholder="Enter patient's full name" 
                className="bg-transparent border-gray-200 dark:border-gray-700 font-black h-12 text-lg"
              />
              {errors.name && <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider mt-1 block">{errors.name.message}</span>}
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Pincode</label>
                <Input 
                  type="text" 
                  {...register("pin")} 
                  placeholder="Postal Code" 
                  className="bg-transparent border-gray-200 dark:border-gray-700 font-bold"
                />
              </div>
              <div className="flex-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Secondary Phone</label>
                <div className="flex gap-2 items-center">
                  <span className="bg-(--sidebar-active-bg) border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-xs font-bold text-gray-500">+91</span>
                  <Input 
                    type="text" 
                    {...register("phone2")} 
                    placeholder="Alternate No." 
                    className="bg-transparent border-gray-200 dark:border-gray-700"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Gender Identification</label>
                <Select
                  {...register("gender")}
                  options={GENDER_OPTIONS}
                  defaultValue="Male"
                  className="bg-transparent border-gray-200 dark:border-gray-700 font-bold"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Age (Years) <span className="text-red-500">*</span></label>
                <Input 
                  type="number" 
                  {...register("age", { required: "Age is required" })} 
                  placeholder="00" 
                  className="bg-transparent border-gray-200 dark:border-gray-700 font-black h-12 text-lg"
                />
                {errors.age && <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider mt-1 block">{errors.age.message}</span>}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Account Ledger Type <span className="text-red-500">*</span></label>
              <Select
                {...register("ledger", { required: "Ledger is required" })}
                options={[
                  { label: "Cash Account", value: "cash" },
                  { label: "Credit / Insurance", value: "other" },
                ]}
                defaultValue="cash"
                className="bg-transparent border-gray-200 dark:border-gray-700 font-black"
              />
              {errors.ledger && <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider mt-1 block">{errors.ledger.message}</span>}
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Contact Email Address</label>
              <Input 
                type="email" 
                {...register("email")} 
                placeholder="patient@example.com" 
                className="bg-transparent border-gray-200 dark:border-gray-700"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">WhatsApp for Notifications</label>
              <div className="flex gap-2 items-center">
                <span className="bg-(--sidebar-active-bg) border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-xs font-bold text-gray-500">+91</span>
                <Input 
                  type="text" 
                  {...register("whatsapp")} 
                  placeholder="WhatsApp Number" 
                  className="bg-transparent border-gray-200 dark:border-gray-700"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 mt-6">
              <label className="flex items-center gap-3 p-3 rounded-2xl bg-(--sidebar-active-bg) border border-(--primary-color)/10 cursor-pointer group transition-all w-fit pr-8">
                <Input
                  width="w-5"
                  type="checkbox"
                  className="w-5 h-5 text-(--primary-color) border-gray-300 rounded-lg focus:ring-(--primary-color)"
                  checked={showMoreOptions}
                  onChange={() => setShowMoreOptions((v) => !v)}
                />
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-(--text-main) tracking-tight">Advanced Profile</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Medical history & Discount</span>
                </div>
              </label>
            </div>
          </div>

          
          <div
            className={`transition-all duration-500 overflow-hidden px-1 ${
              showMoreOptions ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {showMoreOptions && (
              <div className="p-8 rounded-3xl bg-(--sidebar-active-bg)/30 border border-(--primary-color)/5 mb-8 animate-fade-in space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Date of Birth</label>
                    <Input type="date" {...register("dob")} className="bg-transparent border-gray-200 dark:border-gray-700 font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Customer Segment</label>
                    <Select {...register("patientType")} options={PATIENT_TYPE_OPTIONS} defaultValue="Regular" className="bg-transparent border-gray-200 dark:border-gray-700 font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Medical Condition</label>
                    <Select {...register("disease")} options={DISEASE_OPTIONS} defaultValue="" className="bg-transparent border-gray-200 dark:border-gray-700" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Government Issued Identification</label>
                    <Input type="text" {...register("govId")} placeholder="Aadhar / PAN / Driving License" className="bg-transparent border-gray-200 dark:border-gray-700" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-(--primary-color) mb-2">Default Billing Discount</label>
                    <div className="flex items-center">
                      <span className="bg-(--primary-color)/10 border border-(--primary-color)/20 text-(--primary-color) rounded-lg px-3 py-2 text-xs font-black">₹</span>
                      <Input 
                        type="number" 
                        step="0.01" 
                        {...register("billDiscount")} 
                        placeholder="0.00" 
                        className="bg-transparent border-gray-200 dark:border-gray-700 font-black text-lg ml-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          
          {error && <div className="text-red-500 font-bold text-xs uppercase tracking-widest mb-4 animate-fade-in">❌ {error}</div>}
          {success && <div className="text-green-500 font-bold text-xs uppercase tracking-widest mb-4 animate-fade-in">✅ {success}</div>}
          
          <div className="flex gap-4 mt-8 pt-8 border-t border-gray-50 dark:border-white/5 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              className="px-8"
              disabled={isCreating || isEditing}
            >
              Reset Form
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleBack}
              className="px-8"
              disabled={isCreating || isEditing}
            >
              Close
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isCreating || isEditing}
              className="px-12 shadow-xl shadow-(--primary-color)/20"
            >
              {isEditMode ? "Update Record" : "Save Record"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
