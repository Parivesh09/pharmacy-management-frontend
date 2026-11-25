import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCreatePurchaseMasterMutation, useUpdatePurchaseMasterMutation, useGetPurchaseMasterByIdQuery } from "../../../../services/purchaseMasterApi";
import { useGetLedgersQuery } from "../../../../services/ledgerApi";
import { showToast } from "../../../../components/common/Toast";
import { ArrowLeft, Save, RefreshCw, X } from "lucide-react";
import Input from "../../../../components/common/Input";
import SearchableSelect from "../../../../components/common/SearchableSelect";

const CreatePurchaseMaster = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const { currentCompany } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    purchaseType: "",
    localPurchaseLedgerId: "",
    centralPurchaseLedgerId: "",
    igstPercentage: "0.00",
    cgstPercentage: "0.00",
    sgstPercentage: "0.00",
    cessPercentage: "0.00",
    natureOfTransaction: "Purchase",
    taxability: "Taxable",
    igstLedgerId: "",
    cgstLedgerId: "",
    sgstLedgerId: "",
    cessLedgerId: "",
    description: "",
    sortOrder: "0",
    isActive: true,
    status: "Active"
  });

  const [createPurchaseMaster] = useCreatePurchaseMasterMutation();
  const [updatePurchaseMaster] = useUpdatePurchaseMasterMutation();

  const { data: purchaseMasterData, isLoading: isLoadingPurchaseMaster } = useGetPurchaseMasterByIdQuery(id, {
    skip: !isEditMode
  });

  const { data: ledgersData, isLoading: isLoadingLedgers } = useGetLedgersQuery({ 
    companyId: currentCompany?.id,
    limit: 100,
    isActive: true 
  }, { skip: !currentCompany?.id });

  useEffect(() => {
    if (isEditMode && purchaseMasterData) {
      setFormData({
        purchaseType: purchaseMasterData.purchaseType || "",
        localPurchaseLedgerId: purchaseMasterData.localPurchaseLedgerId || "",
        centralPurchaseLedgerId: purchaseMasterData.centralPurchaseLedgerId || "",
        igstPercentage: purchaseMasterData.igstPercentage?.toString() || "0.00",
        cgstPercentage: purchaseMasterData.cgstPercentage?.toString() || "0.00",
        sgstPercentage: purchaseMasterData.sgstPercentage?.toString() || "0.00",
        cessPercentage: purchaseMasterData.cessPercentage?.toString() || "0.00",
        natureOfTransaction: purchaseMasterData.natureOfTransaction || "Purchase",
        taxability: purchaseMasterData.taxability || "Taxable",
        igstLedgerId: purchaseMasterData.igstLedgerId || "",
        cgstLedgerId: purchaseMasterData.cgstLedgerId || "",
        sgstLedgerId: purchaseMasterData.sgstLedgerId || "",
        cessLedgerId: purchaseMasterData.cessLedgerId || "",
        description: purchaseMasterData.description || "",
        sortOrder: purchaseMasterData.sortOrder?.toString() || "0",
        isActive: purchaseMasterData.isActive ?? true,
        status: purchaseMasterData.status || "Active"
      });
    }
  }, [isEditMode, purchaseMasterData]);

  const handleInputChange = (field, value) => {
    // Handle SearchableSelect which passes an object with value property
    const actualValue = value && typeof value === 'object' ? value.value : value;
    setFormData(prev => ({
      ...prev,
      [field]: actualValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.purchaseType) {
      showToast("Purchase Type is required", "error");
      return;
    }
    if (!formData.localPurchaseLedgerId) {
      showToast("Local Purchase Ledger is required", "error");
      return;
    }
    if (!formData.centralPurchaseLedgerId) {
      showToast("Central Purchase Ledger is required", "error");
      return;
    }
    if (!formData.igstLedgerId) {
      showToast("IGST Ledger is required", "error");
      return;
    }
    if (!formData.cgstLedgerId) {
      showToast("CGST Ledger is required", "error");
      return;
    }
    if (!formData.sgstLedgerId) {
      showToast("SGST Ledger is required", "error");
      return;
    }
    if (!formData.cessLedgerId) {
      showToast("CESS Ledger is required", "error");
      return;
    }
    
    try {
      const submitData = {
        purchaseType: formData.purchaseType,
        localPurchaseLedgerId: formData.localPurchaseLedgerId,
        centralPurchaseLedgerId: formData.centralPurchaseLedgerId,
        igstPercentage: parseFloat(formData.igstPercentage) || 0,
        cgstPercentage: parseFloat(formData.cgstPercentage) || 0,
        sgstPercentage: parseFloat(formData.sgstPercentage) || 0,
        cessPercentage: parseFloat(formData.cessPercentage) || 0,
        natureOfTransaction: formData.natureOfTransaction,
        taxability: formData.taxability,
        igstLedgerId: formData.igstLedgerId,
        cgstLedgerId: formData.cgstLedgerId,
        sgstLedgerId: formData.sgstLedgerId,
        cessLedgerId: formData.cessLedgerId,
        description: formData.description,
        sortOrder: parseInt(formData.sortOrder) || 0,
      };

      console.log("Submitting purchase master data:", submitData);

      if (isEditMode) {
        await updatePurchaseMaster({ id, ...submitData }).unwrap();
        showToast("Purchase master updated successfully", "success");
      } else {
        await createPurchaseMaster(submitData).unwrap();
        showToast("Purchase master created successfully", "success");
      }
      
      navigate("/master/accounts/purchase");
    } catch (error) {
      console.error("Purchase master error:", error);
      showToast(error?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} purchase master`, "error");
    }
  };

  const handleClear = () => {
    setFormData({
      purchaseType: "",
      localPurchaseLedgerId: "",
      centralPurchaseLedgerId: "",
      igstPercentage: "0.00",
      cgstPercentage: "0.00",
      sgstPercentage: "0.00",
      cessPercentage: "0.00",
      natureOfTransaction: "Purchase",
      taxability: "Taxable",
      igstLedgerId: "",
      cgstLedgerId: "",
      sgstLedgerId: "",
      cessLedgerId: "",
      description: "",
      sortOrder: "0",
      isActive: true,
      status: "Active"
    });
  };

  const handleClose = () => {
    navigate("/master/accounts/purchase");
  };

  const ledgersData_list = useMemo(() => ledgersData?.data || [], [ledgersData?.data]);

  // Find the "Purchase" ledger for display
  const purchaseLedger = ledgersData_list.find(ledger => 
    ledger.ledgerName?.toLowerCase() === "purchase"
  );

  // Filter ledgers for tax-related (Input for Purchase)
  const taxLedgerOptions = ledgersData_list.filter(ledger => {
    const ledgerName = ledger.ledgerName?.toLowerCase() || "";
    // Allow only tax input ledgers for purchase
    return ledgerName.includes("input") || ledgerName.includes("cess");
  }).map(ledger => ({
    value: ledger.id,
    label: ledger.ledgerName
  }));

  // Auto-select default ledgers when data loads (only for create mode)
  useEffect(() => {
    if (!isEditMode && ledgersData_list.length > 0 && !formData.localPurchaseLedgerId) {
      const purchaseLedgerFound = ledgersData_list.find(ledger => 
        ledger.ledgerName?.toLowerCase() === "purchase"
      );
      const igstLedger = ledgersData_list.find(l => l.ledgerName?.toLowerCase() === "igst input");
      const cgstLedger = ledgersData_list.find(l => l.ledgerName?.toLowerCase() === "cgst input");
      const sgstLedger = ledgersData_list.find(l => l.ledgerName?.toLowerCase() === "sgst input");
      // For CESS, try to find a specific CESS input ledger, otherwise use IGST Input as fallback
      const cessLedger = ledgersData_list.find(l => 
        l.ledgerName?.toLowerCase().includes("cess") && l.ledgerName?.toLowerCase().includes("input")
      ) || igstLedger;

      setFormData(prev => ({
        ...prev,
        localPurchaseLedgerId: purchaseLedgerFound?.id || "",
        centralPurchaseLedgerId: purchaseLedgerFound?.id || "",
        igstLedgerId: igstLedger?.id || "",
        cgstLedgerId: cgstLedger?.id || "",
        sgstLedgerId: sgstLedger?.id || "",
        cessLedgerId: cessLedger?.id || "",
      }));
    }
  }, [ledgersData_list, isEditMode, formData.localPurchaseLedgerId]);

  if (isLoadingPurchaseMaster) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto h-full bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleClose}
            className="flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <h1 className="text-lg font-medium">
            {isEditMode ? "Edit Purchase Master" : "Create Purchase Master"}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className="px-4 py-1 text-sm bg-teal-600 text-white rounded hover:bg-teal-700 flex items-center gap-1"
          >
            <Save size={16} /> F10 Save
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1"
          >
            <RefreshCw size={16} /> F9 Clear
          </button>
          <button
            onClick={handleClose}
            className="px-4 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1"
          >
            <X size={16} /> Esc Close
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Purchase Type Section */}
        <div className="bg-white rounded border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Purchase Type</h3>
          <Input
            label="Purchase Type *"
            name="purchaseType"
            value={formData.purchaseType}
            onChange={(e) => handleInputChange("purchaseType", e.target.value)}
            placeholder="Enter purchase type (e.g., GST Purchase - 12%)"
            required
          />
        </div>

        {/* Purchase Ledger Section */}
        <div className="bg-white rounded border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Purchase Ledger *</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Local Purchase Ledger</label>
              <input
                type="text"
                value={purchaseLedger?.ledgerName || "Purchase"}
                disabled
                className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 text-gray-600 text-xs"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Central Purchase Ledger</label>
              <input
                type="text"
                value={purchaseLedger?.ledgerName || "Purchase"}
                disabled
                className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 text-gray-600 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Tax Percentages Section */}
        <div className="bg-white rounded border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Tax Percentages</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input
              label="IGST %"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.igstPercentage}
              onChange={(e) => handleInputChange("igstPercentage", e.target.value)}
            />
            <Input
              label="CGST %"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.cgstPercentage}
              onChange={(e) => handleInputChange("cgstPercentage", e.target.value)}
            />
            <Input
              label="SGST %"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.sgstPercentage}
              onChange={(e) => handleInputChange("sgstPercentage", e.target.value)}
            />
            <Input
              label="CESS %"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.cessPercentage}
              onChange={(e) => handleInputChange("cessPercentage", e.target.value)}
            />
          </div>
        </div>

        {/* Tax Ledgers Section */}
        <div className="bg-white rounded border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Tax Ledgers *</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchableSelect
              label="IGST Ledger"
              value={formData.igstLedgerId}
              onChange={(value) => handleInputChange("igstLedgerId", value)}
              options={taxLedgerOptions}
              placeholder="Select IGST Input ledger"
              isLoading={isLoadingLedgers}
            />
            <SearchableSelect
              label="CGST Ledger"
              value={formData.cgstLedgerId}
              onChange={(value) => handleInputChange("cgstLedgerId", value)}
              options={taxLedgerOptions}
              placeholder="Select CGST Input ledger"
              isLoading={isLoadingLedgers}
            />
            <SearchableSelect
              label="SGST Ledger"
              value={formData.sgstLedgerId}
              onChange={(value) => handleInputChange("sgstLedgerId", value)}
              options={taxLedgerOptions}
              placeholder="Select SGST Input ledger"
              isLoading={isLoadingLedgers}
            />
            <SearchableSelect
              label="CESS Ledger"
              value={formData.cessLedgerId}
              onChange={(value) => handleInputChange("cessLedgerId", value)}
              options={taxLedgerOptions}
              placeholder="Select CESS Input ledger"
              isLoading={isLoadingLedgers}
            />
          </div>
        </div>

        {/* Taxability Section */}
        <div className="bg-white rounded border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Taxability *</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Taxable", "Exempted", "Nil Rated", "Zero Rated"].map((option) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="taxability"
                  value={option}
                  checked={formData.taxability === option}
                  onChange={(e) => handleInputChange("taxability", e.target.value)}
                  className="w-4 h-4 text-teal-600"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="bg-white rounded border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter description"
            />
            <Input
              label="Sort Order"
              type="number"
              value={formData.sortOrder}
              onChange={(e) => handleInputChange("sortOrder", e.target.value)}
              placeholder="Enter sort order"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePurchaseMaster; 