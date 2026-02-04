import { useState, useEffect } from "react";

import Input from "../../../../componets/common/Input";
import Select from "../../../../componets/common/Select";
import Button from "../../../../componets/common/Button";
import { useNavigate, useParams } from "react-router-dom";
import { Save, Eraser, X } from "lucide-react";
import EmailWebsiteModal from "./EmailWebsiteModal";
import {
  useAddCompanyMutation,
  useGetCompaniesQuery,
  useUpdateCompanyMutation,
} from "../../../../services/companyApi";

export default function CompanyForm({
  isEditMode = false,
  initialData = null,
}) {
  const { id } = useParams();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    companyname: "",
    printremark: "Sample remark for printing",
    status: "Continue",
    prohibited: "No",
    invoiceprintindex: 1,
    recorderformula: 0.0,
    recorderprefrence: 1,
    expiredays: 90,
    dumpdays: 60,
    minimummargin: 0.0,
    storeroom: 1,
    isMoreOptions: false,
  });
  const [addCompany, { isLoading: isCreating }] = useAddCompanyMutation();
  const [editCompany, { isLoading: isEditing }] = useUpdateCompanyMutation();
  const { data: companies } = useGetCompaniesQuery();

  const navigate = useNavigate();

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [emailWebsite, setEmailWebsite] = useState({
    main: "",
    cc: "",
    bcc: "",
    url: "",
  });

  useEffect(() => {
    if (isEditMode && id && companies) {
      const company = companies?.data?.find(
        (company) => parseInt(company.id) === parseInt(id)
      );
      if (company) setFormData(company);
    } else if (initialData) {
      setFormData(initialData);
    }
  }, [isEditMode, id, companies, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "isMoreOptions") {
      setFormData((prevData) => ({
        ...prevData,
        printremark: "",
        status: "",
        prohibited: "",
        invoiceprintindex: null,
        recorderformula: null,
        recorderprefrence: null,
        expiredays: null,
        dumpdays: null,
        minimummargin: null,
        storeroom: null,
      }));
    }
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (isEditMode) {
        await editCompany({ id, ...formData, ...emailWebsite }).unwrap();
        setSuccess("Company updated successfully!");
      } else {
        await addCompany({ ...formData, ...emailWebsite }).unwrap();
        setSuccess("Company created successfully!");
      }
      setFormData({
        companyname: "",
        printremark: "Sample remark for printing",
        status: "Continue",
        prohibited: "No",
        invoiceprintindex: 1,
        recorderformula: 0.0,
        recorderprefrence: 1,
        expiredays: 90,
        dumpdays: 60,
        minimummargin: 0.0,
        storeroom: 1,
      });
      setEmailWebsite({ main: "", cc: "", bcc: "", url: "" });
      navigate("/master/inventory/companies");
    } catch (err) {
      setError(
        err?.data?.message ||
          (isEditMode ? "Failed to update company" : "Failed to create company")
      );
    }
  };

  const handleClear = () => {
    setFormData({
      companyname: "",
      printremark: "Sample remark for printing",
      status: "Continue",
      prohibited: "No",
      invoiceprintindex: 1,
      recorderformula: 0.0,
      recorderprefrence: 1,
      expiredays: 90,
      dumpdays: 60,
      minimummargin: 0.0,
      storeroom: 1,
    });
    setEmailWebsite({ main: "", cc: "", bcc: "", url: "" });
  };

  const handleBack = () => {
    navigate("/master/inventory/companies");
  };

  return (
    <div className="flex justify-center items-start min-h-[calc(100vh-100px)] bg-(--bg-main) py-6 tracking-tight">
      <div className="bg-(--card-bg) rounded-3xl shadow-2xl p-8 max-w-4xl w-full border border-gray-100 dark:border-white/5">
        <div className="flex items-center justify-between mb-8 border-b border-gray-50 dark:border-white/5 pb-4">
          <h1 className="text-3xl font-black italic tracking-tighter text-(--text-main)">
            {isEditMode ? "EDIT COMPANY" : "CREATE COMPANY"}
          </h1>
          <Button type="button" variant="secondary" onClick={handleBack}>
            &#8592; Back to List
          </Button>
        </div>
        <form onSubmit={handleSave}>
          <div className="mb-6">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
              Manufacturer Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="companyname"
              value={formData.companyname}
              onChange={handleChange}
              placeholder="Enter manufacturer name"
              required
              className="bg-transparent border-gray-200 dark:border-gray-700 font-bold h-12 text-lg focus:ring-2 focus:ring-(--primary-color)"
            />
          </div>
          <div className="mb-6 w-full">
            <label className="flex items-center gap-3 p-4 rounded-2xl bg-(--sidebar-active-bg) border border-(--primary-color)/10 cursor-pointer group transition-all hover:bg-(--sidebar-active-bg)/80">
              <Input
                width="w-5"
                type="checkbox"
                name="isMoreOptions"
                checked={formData.isMoreOptions}
                onChange={handleChange}
                className="h-5 w-5 text-(--primary-color) border-gray-300 rounded-lg focus:ring-(--primary-color)"
              />
              <div className="flex flex-col">
                <span className="font-bold text-sm text-(--text-main) tracking-tight">
                  Advanced Configuration
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Configure expiry, storage and reporting preferences
                </span>
              </div>
            </label>
          </div>
          <div
            className={`transition-all duration-500 overflow-hidden ${
              formData.isMoreOptions
                ? "max-h-[1000px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            {formData.isMoreOptions && (
                <div className="mb-6 p-6 rounded-3xl border border-gray-100 dark:border-white/5 space-y-6">
                  <div className="col-span-full">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                      Print Remark (Default)
                    </label>
                    <Input
                      type="text"
                      name="printremark"
                      value={formData.printremark}
                      onChange={handleChange}
                      className="bg-transparent border-gray-200 dark:border-gray-700 font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                        Operational Status
                      </label>
                      <Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="bg-transparent border-gray-200 dark:border-gray-700 font-bold"
                      >
                        <option value="Continue">Continue</option>
                        <option value="Discontinued">Discontinued</option>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                        Reorder Preference
                      </label>
                      <Input
                        type="number"
                        name="recorderprefrence"
                        value={formData.recorderprefrence}
                        onChange={handleChange}
                        className="bg-transparent border-gray-200 dark:border-gray-700 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                        Storage Rm No.
                      </label>
                      <Input
                        type="number"
                        name="storeroom"
                        value={formData.storeroom}
                        onChange={handleChange}
                        className="bg-transparent border-gray-200 dark:border-gray-700 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                        Prohibition
                      </label>
                      <Select
                        name="prohibited"
                        value={formData.prohibited}
                        onChange={handleChange}
                        className="bg-transparent border-gray-200 dark:border-gray-700 font-bold"
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                        Invoice Index
                      </label>
                      <Input
                        type="number"
                        name="invoiceprintindex"
                        value={formData.invoiceprintindex}
                        onChange={handleChange}
                        className="bg-transparent border-gray-200 dark:border-gray-700 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                        Expiry Recv (Days)
                      </label>
                      <Input
                        type="number"
                        name="expiredays"
                        value={formData.expiredays}
                        onChange={handleChange}
                        className="bg-transparent border-gray-200 dark:border-gray-700 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                        Dump Period (Days)
                      </label>
                      <Input
                        type="number"
                        name="dumpdays"
                        value={formData.dumpdays}
                        onChange={handleChange}
                        className="bg-transparent border-gray-200 dark:border-gray-700 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                        Reorder Formula
                      </label>
                      <Input
                        type="number"
                        name="recorderformula"
                        value={formData.recorderformula}
                        onChange={handleChange}
                        className="bg-transparent border-gray-200 dark:border-gray-700 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                        Min. Margin (%)
                      </label>
                      <Input
                        type="number"
                        name="minimummargin"
                        value={formData.minimummargin}
                        onChange={handleChange}
                        className="bg-transparent border-gray-200 dark:border-gray-700 font-bold"
                      />
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      className="flex items-center gap-2 px-6"
                      onClick={() => setDetailsModalOpen(true)}
                    >
                      + Configure Communication
                    </Button>
                    <EmailWebsiteModal
                      open={detailsModalOpen}
                      onClose={() => setDetailsModalOpen(false)}
                      onSave={setEmailWebsite}
                      initialData={emailWebsite}
                    />
                  </div>
                </div>
              )
            }
          </div>

          {error && <div className="text-red-500 font-bold text-xs uppercase tracking-widest mb-4 animate-fade-in">❌ {error}</div>}
          {success && <div className="text-green-500 font-bold text-xs uppercase tracking-widest mb-4 animate-fade-in">✅ {success}</div>}
          
          <div className="flex gap-4 mt-8 justify-end border-t border-gray-50 dark:border-white/5 pt-6">
            <Button
              type="button"
              variant="outline"
              disabled={isCreating || isEditing}
              onClick={handleClear}
              className="px-8"
            >
              Reset
            </Button>
            <Button
              type="button"
              variant="danger"
              disabled={isCreating || isEditing}
              onClick={handleBack}
              className="px-8"
            >
              Close
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isCreating || isEditing}
              className="px-12 shadow-xl shadow-(--primary-color)/20"
            >
              {isEditMode ? "Update Manufacturer" : "Save Manufacturer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
