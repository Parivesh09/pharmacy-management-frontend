import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCreateSaleMasterMutation, useUpdateSaleMasterMutation, useGetSaleMasterByIdQuery } from "../../../../services/saleMasterApi";
import { useGetLedgersQuery } from "../../../../services/ledgerApi";
import { showToast } from "../../../../components/common/Toast";
import { ArrowLeft, Save, RefreshCw, X } from "lucide-react";
import Input from "../../../../components/common/Input";
import SearchableSelect from "../../../../components/common/SearchableSelect";

const CreateSaleMaster = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const { currentCompany } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    salesType: "",
    localSalesLedgerId: "",
    centralSalesLedgerId: "",
    igstPercentage: "0.00",
    cgstPercentage: "0.00",
    sgstPercentage: "0.00",
    cessPercentage: "0.00",
    natureOfTransaction: "Sales",
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

  const [createSaleMaster] = useCreateSaleMasterMutation();
  const [updateSaleMaster] = useUpdateSaleMasterMutation();

  const { data: saleMasterData, isLoading: isLoadingSaleMaster } = useGetSaleMasterByIdQuery(id, {
    skip: !isEditMode
  });

  const { data: ledgersData, isLoading: isLoadingLedgers } = useGetLedgersQuery({ 
    companyId: currentCompany?.id,
    limit: 100,
    isActive: true 
  }, { skip: !currentCompany?.id });

  useEffect(() => {
    if (isEditMode && saleMasterData) {
      setFormData({
        salesType: saleMasterData.salesType || "",
        localSalesLedgerId: saleMasterData.localSalesLedgerId || "",
        centralSalesLedgerId: saleMasterData.centralSalesLedgerId || "",
        igstPercentage: saleMasterData.igstPercentage?.toString() || "0.00",
        cgstPercentage: saleMasterData.cgstPercentage?.toString() || "0.00",
        sgstPercentage: saleMasterData.sgstPercentage?.toString() || "0.00",
        cessPercentage: saleMasterData.cessPercentage?.toString() || "0.00",
        natureOfTransaction: saleMasterData.natureOfTransaction || "Sales",
        taxability: saleMasterData.taxability || "Taxable",
        igstLedgerId: saleMasterData.igstLedgerId || "",
        cgstLedgerId: saleMasterData.cgstLedgerId || "",
        sgstLedgerId: saleMasterData.sgstLedgerId || "",
        cessLedgerId: saleMasterData.cessLedgerId || "",
        description: saleMasterData.description || "",
        sortOrder: saleMasterData.sortOrder?.toString() || "0",
        isActive: saleMasterData.isActive ?? true,
        status: saleMasterData.status || "Active"
      });
    }
  }, [isEditMode, saleMasterData]);

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
    
    if (!formData.salesType) {
      showToast("Sales Type is required", "error");
      return;
    }
    if (!formData.localSalesLedgerId) {
      showToast("Local Sales Ledger is required", "error");
      return;
    }
    if (!formData.centralSalesLedgerId) {
      showToast("Central Sales Ledger is required", "error");
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
        salesType: formData.salesType,
        localSalesLedgerId: formData.localSalesLedgerId,
        centralSalesLedgerId: formData.centralSalesLedgerId,
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

      console.log("Submitting sale master data:", submitData);

      if (isEditMode) {
        await updateSaleMaster({ id, ...submitData }).unwrap();
        showToast("Sale master updated successfully", "success");
      } else {
        await createSaleMaster(submitData).unwrap();
        showToast("Sale master created successfully", "success");
      }
      
      navigate("/master/accounts/sale");
    } catch (error) {
      console.error("Sale master error:", error);
      showToast(error?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} sale master`, "error");
    }
  };

  const handleClear = () => {
    setFormData({
      salesType: "",
      localSalesLedgerId: "",
      centralSalesLedgerId: "",
      igstPercentage: "0.00",
      cgstPercentage: "0.00",
      sgstPercentage: "0.00",
      cessPercentage: "0.00",
      natureOfTransaction: "Sales",
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
    navigate("/master/accounts/sale");
  };

  const ledgersData_list = useMemo(() => ledgersData?.data || [], [ledgersData?.data]);

  // Find the "Sales" ledger for display
  const salesLedger = ledgersData_list.find(ledger => 
    ledger.ledgerName?.toLowerCase() === "sales"
  );

  // Filter ledgers for tax-related (Output for Sales)
  const taxLedgerOptions = ledgersData_list.filter(ledger => {
    const ledgerName = ledger.ledgerName?.toLowerCase() || "";
    // Allow only tax output ledgers for sales
    return ledgerName.includes("output") || ledgerName.includes("cess");
  }).map(ledger => ({
    value: ledger.id,
    label: ledger.ledgerName
  }));

  // Auto-select default ledgers when data loads (only for create mode)
  useEffect(() => {
    if (!isEditMode && ledgersData_list.length > 0 && !formData.localSalesLedgerId) {
      const salesLedgerFound = ledgersData_list.find(ledger => 
        ledger.ledgerName?.toLowerCase() === "sales"
      );
      const igstLedger = ledgersData_list.find(l => l.ledgerName?.toLowerCase() === "igst output");
      const cgstLedger = ledgersData_list.find(l => l.ledgerName?.toLowerCase() === "cgst output");
      const sgstLedger = ledgersData_list.find(l => l.ledgerName?.toLowerCase() === "sgst output");
      // For CESS, try to find a specific CESS output ledger, otherwise use IGST Output as fallback
      const cessLedger = ledgersData_list.find(l => 
        l.ledgerName?.toLowerCase().includes("cess") && l.ledgerName?.toLowerCase().includes("output")
      ) || igstLedger;

      setFormData(prev => ({
        ...prev,
        localSalesLedgerId: salesLedgerFound?.id || "",
        centralSalesLedgerId: salesLedgerFound?.id || "",
        igstLedgerId: igstLedger?.id || "",
        cgstLedgerId: cgstLedger?.id || "",
        sgstLedgerId: sgstLedger?.id || "",
        cessLedgerId: cessLedger?.id || "",
      }));
    }
  }, [ledgersData_list, isEditMode, formData.localSalesLedgerId]);

  if (isLoadingSaleMaster) {
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
            {isEditMode ? "Edit Sale Master" : "Create Sale Master"}
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
        {/* Sales Type Section */}
        <div className="bg-white rounded border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Sales Type</h3>
          <Input
            label="Sales Type *"
            name="salesType"
            value={formData.salesType}
            onChange={(e) => handleInputChange("salesType", e.target.value)}
            placeholder="Enter sales type (e.g., GST Sale - 12%)"
            required
          />
        </div>

        {/* Sales Ledger Section */}
        <div className="bg-white rounded border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Sales Ledger *</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Local Sales Ledger</label>
              <input
                type="text"
                value={salesLedger?.ledgerName || "Sales"}
                disabled
                className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 text-gray-600 text-xs"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Central Sales Ledger</label>
              <input
                type="text"
                value={salesLedger?.ledgerName || "Sales"}
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
              placeholder="Select IGST Output ledger"
              isLoading={isLoadingLedgers}
            />
            <SearchableSelect
              label="CGST Ledger"
              value={formData.cgstLedgerId}
              onChange={(value) => handleInputChange("cgstLedgerId", value)}
              options={taxLedgerOptions}
              placeholder="Select CGST Output ledger"
              isLoading={isLoadingLedgers}
            />
            <SearchableSelect
              label="SGST Ledger"
              value={formData.sgstLedgerId}
              onChange={(value) => handleInputChange("sgstLedgerId", value)}
              options={taxLedgerOptions}
              placeholder="Select SGST Output ledger"
              isLoading={isLoadingLedgers}
            />
            <SearchableSelect
              label="CESS Ledger"
              value={formData.cessLedgerId}
              onChange={(value) => handleInputChange("cessLedgerId", value)}
              options={taxLedgerOptions}
              placeholder="Select CESS Output ledger"
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

export default CreateSaleMaster; 