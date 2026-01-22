import { useForm } from "react-hook-form";
import { useAddItemMutation, useUpdateItemMutation, useGetItemByIdQuery } from "../../../../services/itemApi";
import Input from "../../../../componets/common/Input";
import Select from "../../../../componets/common/Select";
import Button from "../../../../componets/common/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { showToast } from "../../../../componets/common/Toast";
import { SelectField, TextField } from "../../../../componets/common/Fields";
import LeftColumn from "./components/LeftColumn";
import RightColumn from "./components/RightColumn";
import { useGetRacksQuery } from "../../../../services/rackApi";
import { useGetCompaniesQuery } from "../../../../services/companyApi";
import { useGetSaltsQuery } from "../../../../services/saltApi";
import { useGetUnitsQuery } from "../../../../services/unitApi";
import { useGetHSNsQuery } from "../../../../services/hsnApi";
import CreateUnitForm from "../unit/AddUnit";
import CreateHsnSacForm from "../hsn/AddHSN";
import AddRack from "../rack/AddRack";
import { useGetPurchaseMastersQuery } from "../../../../services/purchaseMasterApi";
import { useSelector } from "react-redux";

const ADVANCE_TABS = ["Discount", "Quantity", "Other Info"];

export default function CreateItemPage({ isEditMode = false }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentCompany } = useSelector((state) => state.user);
  const [addItem, { isLoading: isAdding }] = useAddItemMutation();
  const [updateItem, { isLoading: isUpdating }] = useUpdateItemMutation();
  const { data: itemData, isLoading: isLoadingItem } = useGetItemByIdQuery(id, { skip: !isEditMode });
  
  const isLoading = isAdding || isUpdating || (isEditMode && isLoadingItem);
  const [showAdvance, setShowAdvance] = useState(false);
  const [activeTab, setActiveTab] = useState("Discount");
  const [selectedRack, setSelectedRack] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedSalt, setSelectedSalt] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedUnit2, setSelectedUnit2] = useState(null);
  const [selectedHSN, setSelectedHSN] = useState(null);
  const [selectedTaxCategory, setSelectedTaxCategory] = useState(null);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isHSNModalOpen, setIsHSNModalOpen] = useState(false);
  const [isRackModalOpen, setIsRackModalOpen] = useState(false);


  const { data: rackData } = useGetRacksQuery();
  const { data: companyData } = useGetCompaniesQuery();
  const { data: saltData } = useGetSaltsQuery({ companyId: currentCompany?.id }, { skip: !currentCompany?.id });
  const { data: unitData } = useGetUnitsQuery();
  const { data: hsnData } = useGetHSNsQuery();
  const {data : taxcategoryData} = useGetPurchaseMastersQuery();

  const allData = {
    rackData,
    companyData,
    saltData,
    unitData,
    hsnData,
    taxcategoryData
  };

  const allSetters = {
    setSelectedRack,
    setSelectedCompany,
    setSelectedSalt,
    setSelectedUnit,
    setSelectedUnit2,
    setSelectedHSN,
    setSelectedTaxCategory
  };

  const allStates = {
    selectedRack,
    selectedCompany,
    selectedSalt,
    selectedUnit,
    selectedUnit2,
    selectedHSN,
    selectedTaxCategory
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      productname: "",
      goods: "Goods",
      packing: "",
      unit1: "",
      unit2: null,
      conversion: null,
      unitindecimal: "No",
      hsnsac: "",
      taxcategory: "",
      company: "",
      salt: "",
      rack: "",
      price: "",
      purchasePrice: "",
      cost: "",
      salerate: "",
      narcotic: "No",
      scheduleH: "No",
      scheduleH1: "No",
      scheduledrug: "No",
      prescription: "No",
      storagetype: "Normal",
      colortype: "",
      status: "Continue",
      tbitem: "Normal",
      discountType: "Not Applicable",
      itemDisc1: null,
      maxDisc: null,
      contraindications: "",
      relativeContraindications: "",
      minStock: "",
      maxStock: "",
      reorderLevel: "",
    },
  });

  useEffect(() => {
    if (isEditMode && itemData?.data) {
      const rawData = itemData.data;
      
      // Helper to extract ID from populated objects or use value as is
      const getId = (val) => (val && typeof val === 'object' ? (val._id || val.id) : val);

      const data = {
        ...rawData,
        company: getId(rawData.company || rawData.CompanyDetails), 
        unit1: getId(rawData.unit1 || rawData.Unit1), 
        unit2: getId(rawData.unit2 || rawData.Unit2),
        rack: getId(rawData.rack),
        salt: getId(rawData.salt),
        hsnsac: getId(rawData.hsnsac),
        taxcategory: getId(rawData.taxcategory),
      };

      console.log("Edit Mode Data Loaded:", data);
      reset(data);
      
      // Update local states for dependent dropdowns or UI sync
      if (data.rack) setSelectedRack(data.rack);
      if (data.company) setSelectedCompany(data.company);
      if (data.salt) setSelectedSalt(data.salt);
      if (data.unit1) setSelectedUnit(data.unit1);
      if (data.unit2) setSelectedUnit2(data.unit2);
      if (data.hsnsac) setSelectedHSN(data.hsnsac);
      if (data.taxcategory) setSelectedTaxCategory(data.taxcategory);
    }
  }, [itemData, isEditMode, reset]);


  const handleSave = async (data) => {
    try {
      const requiredFields = {
        productname: "Product Name",
        unit1: "Unit",
        hsnsac: "HSN/SAC",
        taxcategory: "Tax Category",
        company: "Company"
      };

      const missingFields = [];
      for (const [field, label] of Object.entries(requiredFields)) {
        if (!data[field] || data[field].trim?.() === "" || data[field] === "") {
          missingFields.push(label);
        }
      }

      if (missingFields.length > 0) {
        showToast(`Please fill required fields: ${missingFields.join(", ")}`, { type: "error" });
        return;
      }

      if (isEditMode) {
        await updateItem({ id, ...data }).unwrap();
        showToast("Item updated successfully", { type: "success" });
      } else {
        await addItem(data).unwrap();
        showToast("Data saved successfully", { type: "success" });
        reset();
      }
    } catch (error) {
      showToast(error?.data?.message || `Failed to ${isEditMode ? 'update' : 'save'} item`, { type: "error" });
    }
  };

  const handleClear = () => {
    showToast("All Fields Cleared", { type: "success" });
    reset();
  };

  const handleBack = () => navigate("/master/inventory/items");
  const handleClose = () => navigate("/master/inventory/items");

  return (
    <div className="flex flex-col overflow-hidden no-scrollbar">
      
      <AddRack isOpen={isRackModalOpen} onClose={() => setIsRackModalOpen(false)} />
      <CreateUnitForm isOpen={isUnitModalOpen} onClose={() => setIsUnitModalOpen(false)} />
      <CreateHsnSacForm isOpen={isHSNModalOpen} onClose={() => setIsHSNModalOpen(false)} />
      <form
        onSubmit={handleSubmit(handleSave)}
        className="flex-1 flex flex-col relative"
      >
        <div className="flex flex-col lg:flex-row gap-4 p-1">
          
          <div
            className={`
          bg-white rounded shadow p-4 transition-all duration-500
          ${showAdvance ? "lg:w-3/5" : "lg:w-full"} w-full
        `}
          >
            
            <div className="flex items-center justify-between sticky top-0 z-10 bg-white">
              <h1 className="text-xl font-bold">{isEditMode ? "Edit Item" : "Create Item"}</h1>
              <Button type="button" variant="secondary" onClick={handleBack}>
                &#8592; Back
              </Button>
            </div>

            
            <div className="flex mb-2 pb-2 border-b justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-base border-b-2 border-black pb-1">
                  Basic Info
                </span>
                <div className="flex items-center">
                  <Input
                    type="checkbox"
                    {...register("advance")}
                    onChange={(e) => setShowAdvance(e.target.checked)}
                    className="mr-1"
                  />
                  <span className="font-semibold text-sm min-w-fit">
                    Advance Info
                  </span>
                </div>
              </div>
            </div>

            
            <div className="space-y-4 text-m">
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block font-medium mb-1">Product *</label>
                  <Input
                    className="h-8 w-full text-m"
                    {...register("productname", {
                      required: "Product Name is required",
                    })}
                  />
                  {errors.productname && (
                    <span className="text-m text-red-500">
                      {errors.productname.message}
                    </span>
                  )}
                </div>
                <div className="sm:w-40 w-full">
                  <label className="block font-medium mb-1">Goods</label>
                  <Select
                    noPadding
                    className="h-8 w-full text-m"
                    {...register("goods")}
                  >
                    <option value="Goods">Goods</option>
                    <option value="Services">Services</option>
                  </Select>
                </div>
              </div>

              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <LeftColumn
                  allData={allData}
                  setters={allSetters}
                  states={allStates}
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  onCreateRack={() => setIsRackModalOpen(true)}
                  onCreateUnit={() => setIsUnitModalOpen(true)}
                  onCreateHSN={() => setIsHSNModalOpen(true)}
                  onCreateCompany={() => navigate("/master/inventory/company/create")}
                  onCreateSalt={() => navigate("/master/inventory/salt/create")}
                />
                <RightColumn register={register} errors={errors} watch={watch} />
              </div>
            </div>

            
            <div className="bg-white h-10 py-2 flex items-center gap-2 justify-end z-10 sticky bottom-0 text-m">
              <Button type="button" variant="secondary" onClick={handleBack}>
                F4 Switch Tab
              </Button>
              <Button
                type="submit"
                buttonType={"save"}
                variant="primary"
                disabled={isLoading}
              >
                {isEditMode ? "Update" : "Save"}
              </Button>
              <Button
                type="button"
                buttonType={"clear"}
                variant="secondary"
                onClick={handleClear}
              >
                Clear
              </Button>
              <Button
                type="button"
                buttonType={"close"}
                variant="danger"
                onClick={handleClose}
              >
                Close
              </Button>
            </div>
          </div>

          
          <div
            className={`
          transition-all duration-500
          ${showAdvance ? "lg:w-2/5 w-full" : "lg:w-0 w-0"}
          overflow-hidden
        `}
          >
            {showAdvance && (
              <div className="w-full bg-white rounded border border-gray-300 p-2">
                <div className="flex gap-2 border-b mb-2">
                  {ADVANCE_TABS.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      className={`px-3 py-1 text-m font-medium border-b-2 ${
                        activeTab === tab
                          ? "border-blue-600 text-blue-700"
                          : "border-transparent text-gray-500"
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                
                {activeTab === "Discount" && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-m">
                    <div>
                      <label className="block font-medium mb-1">Discount</label>
                      <Select
                        noPadding
                        className="h-8 text-m"
                        {...register("discountType")}
                      >
                        <option value="Applicable">Applicable</option>
                        <option value="Not Applicable">Not Applicable</option>
                      </Select>
                    </div>
                    <div>
                      <label className="block font-medium mb-1">
                        Item Disc 1 %
                      </label>
                      <Input
                        className="h-8 text-m"
                        type="number"
                        {...register("itemDisc1")}
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">
                        Max Disc%
                      </label>
                      <Input
                        className="h-8 text-m"
                        type="number"
                        {...register("maxDisc")}
                      />
                    </div>
                  </div>
                )}
                {activeTab === "Quantity" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-m">
                     <div>
                      <label className="block font-medium mb-1">Min Stock</label>
                      <Input
                        className="h-8 text-m"
                        type="number"
                        {...register("minStock")}
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Max Stock</label>
                      <Input
                        className="h-8 text-m"
                        type="number"
                        {...register("maxStock")}
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Reorder Level</label>
                      <Input
                        className="h-8 text-m"
                        type="number"
                        {...register("reorderLevel")}
                      />
                    </div>
                  </div>
                )}
                {activeTab === "Other Info" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-m">
                     <div>
                      <label className="block font-medium mb-1">Narcotic</label>
                      <Select
                        noPadding
                        className="h-8 text-m"
                        {...register("narcotic")}
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </Select>
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Schedule H</label>
                       <Select
                        noPadding
                        className="h-8 text-m"
                        {...register("scheduleH")}
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </Select>
                    </div>
                     <div>
                      <label className="block font-medium mb-1">Schedule H1</label>
                       <Select
                        noPadding
                        className="h-8 text-m"
                        {...register("scheduleH1")}
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </Select>
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Schedule Drug</label>
                       <Select
                        noPadding
                        className="h-8 text-m"
                        {...register("scheduledrug")}
                      >
                       <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </Select>
                    </div>
                     <div>
                      <label className="block font-medium mb-1">Prescription</label>
                       <Select
                        noPadding
                        className="h-8 text-m"
                        {...register("prescription")}
                      >
                         <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </Select>
                    </div>
                     <div>
                      <label className="block font-medium mb-1">Storage Type</label>
                       <Select
                        noPadding
                        className="h-8 text-m"
                        {...register("storagetype")}
                      >
                        <option value="Normal">Normal</option>
                        <option value="Cold Storage">Cold Storage</option>
                         <option value="Refridgerator">Refridgerator</option>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
