import { useState, useEffect } from "react";
import {
  useAddSaltMutation,
  useEditSaltMutation,
  useGetSaltsQuery,
} from "../../../../services/saltApi";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../../../componets/common/Input";
import Select from "../../../../componets/common/Select";
import Button from "../../../../componets/common/Button";
import InputFields from "./components/InputFields";
import SaltVariTable from "./components/SaltVariTable";
import { Eraser, Loader, SaveIcon, X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { showToast } from "../../../../componets/common/Toast";

export default function SaltForm({
  isEditMode = false,
  initialData = null,
  onSave,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [variants, setVariants] = useState([
    {
      strength: "",
      dosageForm: "",
      brandName: "",
      packSize: "",
      mrp: "",
      dpco_applicable: false,
      dpco_mrp: "",
    },
  ]);
  const [addSalt, { isLoading }] = useAddSaltMutation();
  const [editSalt, { isLoading: isEditing }] = useEditSaltMutation();
  const { data: salts } = useGetSaltsQuery();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: initialData || {
      saltname: "",
      indication: "",
      dosage: "",
      sideeffects: "",
      specialprecautions: "",
      druginteractions: "",
      note: "",
      tbitem: "Normal",
      status: "Continue",
      prohabit: "No",
      narcotic: "No",
      scheduleh: "No",
      scheduleh1: "No",
      contraindications: "",
      relativeContraindications: "",
    },
  });


  useEffect(() => {
    setValue && setValue("showMoreOptions", showMoreOptions);
  }, [showMoreOptions, setValue]);

  useEffect(() => {
    if (isEditMode && id && salts) {
      const salt = salts.find((c) => parseInt(c.id) === parseInt(id));
      if (salt) {
        reset(salt);
        if (
          Array.isArray(salt.saltvariations) &&
          salt.saltvariations.length > 0
        ) {
          setVariants(
            salt.saltvariations.map((v) => ({
              strength: v.str || "",
              dosageForm: v.dosage || "",
              brandName: v.brandname || "",
              packSize: v.packsize || "",
              mrp: v.mrp || "",
              dpco_applicable: v.dpco === "Yes" || v.dpco === true,
              dpco_mrp: v.dpcomrp || "",
            }))
          );
        }
        const moreInfoFields = [
          "saltcode",
          "salttype",
          "saltgroup",
          "saltsubgroup",
          "saltsubsubgroup",
          "tbitem",
          "narcotic",
          "scheduleh2",
          "scheduleh3",
          "nowstatus",
          "prohibited",
        ];
        if (
          moreInfoFields.some(
            (field) => salt[field] && String(salt[field]).trim() !== ""
          )
        ) {
          setShowMoreOptions(true);
        }
      }
    } else if (initialData) {
      reset(initialData);
    }
  }, [isEditMode, id, salts, initialData, reset]);

  const handleSave = async (data) => {
    setError("");
    setSuccess("");
    try {

      const allEmpty = variants.every(
        v =>
          !v.strength &&
          !v.dosageForm &&
          !v.brandName &&
          !v.packSize &&
          !v.mrp &&
          !v.dpco_applicable &&
          !v.dpco_mrp
      );
      const payload = {
        saltData: { ...data },
        variationData: allEmpty ? [] : variants,
      };
      if (isEditMode) {
        await editSalt({ id, ...payload }).unwrap();
        setSuccess("Salt updated successfully!");
        showToast("Salt updated successfully!", { type: "success" });
      } else if (onSave) {
        await onSave(payload);
        setSuccess("Salt saved successfully!");
        showToast("Salt saved successfully!", { type: "success" });
      } else {
        await addSalt(payload).unwrap();
        setSuccess("Salt created successfully!");
        showToast("Salt created successfully!", { type: "success" });
      }
      reset();
      setVariants([]);
      navigate("/master/inventory/salts");
      console.log(payload);
    } catch (err) {
      setError(
        err?.data?.message ||
          (isEditMode ? "Failed to update salt" : "Failed to save salt")
      );
      showToast(
        err?.data?.message ||
          (isEditMode ? "Failed to update salt" : "Failed to save salt"),
        { type: "error" }
      );
    }
  };

  const handleClear = () => {
    reset();
    setVariants([]);
  };

  const handleBack = () => navigate("/master/inventory/salts");
  const handleClose = () => navigate("/master/inventory/salts");

  const addVariant = () =>
    setVariants([
      ...variants,
      {
        strength: "",
        dosageForm: "",
        brandName: "",
        packSize: "",
        mrp: "",
        dpco_applicable: false,
        dpco_mrp: "",
      },
    ]);
  const removeVariant = (idx) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== idx));
    }
  };
  const handleVariantChange = (idx, field, value) => {
    const updated = [...variants];
    updated[idx][field] = value;
    setVariants(updated);
  };

  return (
    <div className="flex flex-col min-h-screen bg-(--bg-main) p-4 tracking-tight">
      <form
        onSubmit={handleSubmit(handleSave)}
        className="flex-1 flex flex-col relative"
      >
        <div className="bg-(--card-bg) rounded-3xl shadow-2xl p-8 max-w-6xl mx-auto w-full border border-gray-100 dark:border-white/5 transition-all duration-500">
          <div className="flex items-center justify-between sticky top-0 z-10 bg-(--card-bg) border-b border-gray-50 dark:border-white/5 pb-4 mb-8">
            <h1 className="text-3xl font-black italic tracking-tighter text-(--text-main)">
              {isEditMode ? "EDIT SALT COMPOSITION" : "ADD SALT COMPOSITION"}
            </h1>
            <Button type="button" variant="secondary" onClick={handleBack}>
              &#8592; Back to List
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                Composition Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                {...register("saltname", { required: "Salt Name is required" })}
                className="h-12 text-lg font-bold w-full bg-transparent border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-(--primary-color)"
                placeholder="Enter salt/composition name..."
              />
              {errors.saltname && (
                <p className="text-red-500 text-xs font-bold mt-1 uppercase tracking-wider">
                  {errors.saltname.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                Contraindications
              </label>
              <Input
                type="text"
                {...register("contraindications")}
                className="h-10 text-sm font-medium w-full bg-transparent border-gray-200 dark:border-gray-700"
                placeholder="e.g. Chronic Kidney Disease"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                Relative Contraindications
              </label>
              <Input
                type="text"
                {...register("relativeContraindications")}
                className="h-10 text-sm font-medium w-full bg-transparent border-gray-200 dark:border-gray-700"
                placeholder="e.g. Pregnancy, Lactation"
              />
            </div>
          </div>
          <div className="mb-8">
            <label className="flex items-center gap-3 p-4 rounded-2xl bg-(--sidebar-active-bg) border border-(--primary-color)/10 cursor-pointer group transition-all w-fit pr-8">
              <Input
                width="w-5"
                type="checkbox"
                checked={showMoreOptions}
                onChange={(e) => setShowMoreOptions(e.target.checked)}
                className="w-5 h-5 text-(--primary-color) border-gray-300 rounded-lg focus:ring-(--primary-color)"
              />
              <div className="flex flex-col">
                <span className="font-bold text-sm text-(--text-main) tracking-tight">
                  Detailed Information
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Configure classification, narcotics and legal status
                </span>
              </div>
            </label>
          </div>
          {showMoreOptions && (
            <InputFields register={register} errors={errors} />
          )}
          
          <SaltVariTable
            variants={variants}
            handleVariantChange={handleVariantChange}
            removeVariant={removeVariant}
            addVariant={addVariant}
          />

          {error && <div className="text-red-500 font-bold text-xs uppercase tracking-widest mb-4 animate-fade-in">❌ {error}</div>}
          <div className="flex gap-4 mt-12 justify-end border-t border-gray-50 dark:border-white/5 pt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              className="px-8"
            >
              Reset Form
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
              disabled={isLoading || isEditing}
              className="px-12 shadow-xl shadow-(--primary-color)/20"
            >
              {isEditMode ? "Update Composition" : "Save Composition"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
